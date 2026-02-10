const app = getApp();

Page({
  data: {
    venues: [],
    filteredVenues: [],
    currentType: 'all',
    
    showModal: false,
    selectedVenueId: null,
    selectedVenueName: '',
    
    availableDates: [],
    dateIndex: 0,
    selectedDate: '',
    slots: [],
    selectedSlotId: null,
    remark: '',
    myBookings: []
  },

  onLoad() {
    this.fetchVenues();
  },

  onShow() {
    if (this.data.currentType === 'my_bookings') {
      this.fetchMyBookings();
    }
  },

  async fetchVenues() {
    try {
      const res = await app.callContainer('/api/venues', 'GET');
      // res is already the data array because app.callContainer unwraps it
      const list = Array.isArray(res) ? res : (res.data || []);
      this.setData({ venues: list });
      this.filterVenues();
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '加载场馆失败', icon: 'none' });
    }
  },

  switchType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ currentType: type });
    if (type === 'my_bookings') {
      this.fetchMyBookings();
    } else {
      this.filterVenues();
    }
  },

  async fetchMyBookings() {
    try {
      const res = await app.callContainer('/api/venues/bookings', 'GET');
      const list = Array.isArray(res) ? res : (res.data || []);
      this.setData({ myBookings: list });
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '加载预约记录失败', icon: 'none' });
    }
  },

  filterVenues() {
    const { venues, currentType } = this.data;
    let filtered = venues;
    if (currentType !== 'all') {
      filtered = venues.filter(v => v.type === currentType);
    }
    this.setData({ filteredVenues: filtered });
  },

  showBookingModal(e) {
    const { id, name } = e.currentTarget.dataset;
    this.setData({
      showModal: true,
      selectedVenueId: id,
      selectedVenueName: name,
      availableDates: [],
      dateIndex: 0,
      selectedDate: '',
      slots: [],
      selectedSlotId: null,
      remark: ''
    });
    this.fetchAvailableDates(id);
  },

  hideModal() {
    this.setData({ showModal: false });
  },

  bindDateChange(e) {
    const dateIndex = Number(e.detail.value);
    const selectedDate = this.data.availableDates[dateIndex] || '';
    this.setData({ dateIndex, selectedDate, slots: [], selectedSlotId: null });
    if (selectedDate) {
      this.fetchSlots();
    }
  },
  bindRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  async fetchAvailableDates(venueId) {
    try {
      const res = await app.callContainer(`/api/venues/${venueId}/slots/dates`, 'GET');
      const dates = Array.isArray(res) ? res : (res.data || []);
      const selectedDate = dates[0] || '';
      this.setData({
        availableDates: dates,
        dateIndex: 0,
        selectedDate,
        slots: [],
        selectedSlotId: null
      });
      if (selectedDate) {
        this.fetchSlots();
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '加载时段失败', icon: 'none' });
    }
  },

  async fetchSlots() {
    const { selectedVenueId, selectedDate } = this.data;
    if (!selectedVenueId || !selectedDate) return;
    try {
      const res = await app.callContainer(`/api/venues/${selectedVenueId}/slots?date=${selectedDate}`, 'GET');
      const list = Array.isArray(res) ? res : (res.data || []);
      this.setData({ slots: list });
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '加载时段失败', icon: 'none' });
    }
  },

  selectSlot(e) {
    const { id, available } = e.currentTarget.dataset;
    if (!available) return;
    this.setData({ selectedSlotId: id });
  },

  async submitBooking() {
    const { selectedVenueId, selectedSlotId, remark } = this.data;
    if (!selectedSlotId) {
      wx.showToast({ title: '请选择可预约时段', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '提交中' });
      const res = await app.callContainer('/api/venues/bookings', 'POST', {
        venueId: selectedVenueId,
        slotId: selectedSlotId,
        reason: remark
      });

      wx.hideLoading();
      
      if (res.code === 0) {
        wx.showToast({ title: '预约申请提交成功' });
        this.hideModal();
      } else {
        wx.showToast({ title: res.error || '预约失败', icon: 'none' });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '请求失败', icon: 'none' });
      console.error(err);
    }
  }
});
