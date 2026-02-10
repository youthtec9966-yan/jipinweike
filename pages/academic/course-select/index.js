Page({
  data: {
    courses: []
  },

  onLoad: function (options) {
    this.getCourses();
  },

  getCourses: function() {
    this.setData({
      courses: [
        { id: 1, name: '人工智能导论', credit: 2.0, teacher: '张教授', selected: false },
        { id: 2, name: 'Python程序设计', credit: 3.0, teacher: '李讲师', selected: false },
        { id: 3, name: '音乐鉴赏', credit: 1.5, teacher: '赵老师', selected: true }
      ]
    });
  },

  onSelect: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.courses.find(i => i.id === id);
    
    if (item.selected) {
      wx.showToast({ title: '已选修该课程', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认选课',
      content: '确定要选择 ' + item.name + ' 吗？',
      success: (res) => {
        if (res.confirm) {
          const newList = this.data.courses.map(i => {
            if (i.id === id) return { ...i, selected: true };
            return i;
          });
          this.setData({ courses: newList });
          wx.showToast({ title: '选课成功' });
        }
      }
    });
  }
})