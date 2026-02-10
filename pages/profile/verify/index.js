Page({
  data: {
    name: '',
    studentId: '',
    department: ''
  },

  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    this.setData({
      name: userInfo.realName || '',
      studentId: userInfo.studentId || '',
      department: userInfo.department || ''
    });
  },

  onInput: function(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    });
  },

  onSubmit: function() {
    const { name, studentId, department } = this.data;
    
    if (!name || !studentId || !department) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '提交中...',
    });

    // 模拟提交到后端
    setTimeout(() => {
      const userInfo = wx.getStorageSync('userInfo') || {};
      const newUserInfo = {
        ...userInfo,
        realName: name,
        studentId: studentId,
        department: department
      };
      
      wx.setStorageSync('userInfo', newUserInfo);
      
      wx.hideLoading();
      wx.showToast({
        title: '认证成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
})