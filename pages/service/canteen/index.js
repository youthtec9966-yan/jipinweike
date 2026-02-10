const app = getApp();

Page({
  data: {
    categories: ['全部', '早餐', '午餐', '晚餐', '饮品', '其他'],
    currentCategory: '全部',
    dishes: [], // all dishes
    currentDishes: [], // filtered dishes
    cart: {}, // { dishId: count }
    cartItems: [], // array for modal
    totalCount: 0,
    totalPrice: 0,
    showCheckout: false,
    
    // Form data
    name: '',
    phone: '',
    diningTime: '',
    remark: ''
  },

  onLoad: function() {
    this.fetchDishes();
    // Pre-fill user info if available in storage? 
    // const user = wx.getStorageSync('user_info');
  },

  fetchDishes: async function() {
    try {
      const list = await app.callContainer('/api/canteen/dishes', 'GET');
      if (list) {
        this.setData({ dishes: list });
        this.filterDishes();
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: '加载菜单失败', icon: 'none' });
    }
  },

  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.filterDishes();
  },

  filterDishes: function() {
    const { dishes, currentCategory } = this.data;
    let filtered = dishes;
    if (currentCategory !== '全部') {
      filtered = dishes.filter(d => d.category === currentCategory);
    }
    this.setData({ currentDishes: filtered });
  },

  addToCart: function(e) {
    const item = e.currentTarget.dataset.item;
    const { cart } = this.data;
    const count = (cart[item.id] || 0) + 1;
    cart[item.id] = count;
    this.setData({ cart });
    this.updateCartStats();
  },

  removeFromCart: function(e) {
    const item = e.currentTarget.dataset.item;
    const { cart } = this.data;
    if (cart[item.id] > 0) {
      cart[item.id]--;
      if (cart[item.id] === 0) delete cart[item.id];
      this.setData({ cart });
      this.updateCartStats();
    }
  },

  updateCartStats: function() {
    const { cart, dishes } = this.data;
    let count = 0;
    let price = 0;
    const items = [];

    for (const [id, qty] of Object.entries(cart)) {
      const dish = dishes.find(d => d.id == id);
      if (dish) {
        count += qty;
        price += dish.price * qty;
        items.push({ ...dish, count: qty });
      }
    }

    this.setData({
      totalCount: count,
      totalPrice: price.toFixed(1),
      cartItems: items
    });
  },

  showCheckoutModal: function() {
    if (this.data.totalCount === 0) return;
    this.setData({ showCheckout: true });
  },

  hideCheckoutModal: function() {
    this.setData({ showCheckout: false });
  },

  onInputName(e) { this.setData({ name: e.detail.value }); },
  onInputPhone(e) { this.setData({ phone: e.detail.value }); },
  onTimeChange(e) { this.setData({ diningTime: e.detail.value }); },
  onInputRemark(e) { this.setData({ remark: e.detail.value }); },

  submitOrder: async function() {
    const { name, phone, diningTime, remark, cartItems, totalPrice } = this.data;
    if (!name || !phone || !diningTime) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '提交中' });
    try {
      await app.callContainer('/api/canteen/orders', 'POST', {
        name, phone, diningTime, remark, items: cartItems, totalPrice
      });
      
      wx.hideLoading();
      wx.showToast({ title: '预订成功' });
      this.setData({ 
        showCheckout: false, 
        cart: {}, 
        totalCount: 0, 
        totalPrice: 0,
        name: '',
        phone: '',
        diningTime: '',
        remark: ''
      });
      
      // Navigate to order history? Or stay here?
      // Maybe show success modal
    } catch (err) {
      wx.hideLoading();
      wx.showToast({ title: '提交失败', icon: 'none' });
      console.error(err);
    }
  }
})
