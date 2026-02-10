Page({
  data: {
    evaluations: []
  },

  onLoad: function (options) {
    this.getEvaluations();
  },

  getEvaluations: function() {
    this.setData({
      evaluations: [
        { id: 1, course: '高等数学', teacher: '王老师', status: '待评价' },
        { id: 2, course: '大学英语', teacher: '李老师', status: '已评价' }
      ]
    });
  },

  onEvaluate: function(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.evaluations.find(i => i.id === id);
    if (item.status === '已评价') {
      wx.showToast({ title: '您已评价过该课程', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '评价课程',
      content: '是否对 ' + item.course + ' 进行评价？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '评价提交成功', icon: 'success' });
          // 更新状态
          const newList = this.data.evaluations.map(i => {
            if (i.id === id) return { ...i, status: '已评价' };
            return i;
          });
          this.setData({ evaluations: newList });
        }
      }
    });
  }
})