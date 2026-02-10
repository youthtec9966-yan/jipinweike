Page({
  data: {
    isLogin: false,
    services: [
      // { id: 1, name: '食堂订餐', icon: '🍽️' },
      { id: 2, name: '一卡通', icon: '💳' },
      { id: 3, name: '故障报修', icon: '🔧' },
      { id: 4, name: '场馆预约', icon: '🏟️' },
      { id: 5, name: '快递代取', icon: '📦' },
      { id: 6, name: '电费充值', icon: '⚡' }
    ],
    recentOrders: []
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  checkLoginStatus: function() {
    const openid = wx.getStorageSync('openid');
    if (openid) {
      this.setData({ isLogin: true });
      this.getRecentOrders();
    } else {
      this.setData({ isLogin: false });
    }
  },

  doLogin: function() {
    // 复用登录逻辑，实际项目中应提取为公共方法
    wx.showLoading({ title: '登录中...' });
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
        wx.hideLoading();
        if (res.result && res.result.openid) {
          wx.setStorageSync('openid', res.result.openid);
          this.setData({ isLogin: true });
          this.getRecentOrders();
          wx.showToast({ title: '登录成功' });
        } else {
          console.error('登录失败：无 openid', res);
          this.fallbackLogin();
        }
      },
      fail: err => {
        console.error('云函数调用失败', err);
        wx.hideLoading();
        this.fallbackLogin();
      }
    });
  },

  fallbackLogin: function() {
    wx.showModal({
      title: '提示',
      content: '云登录失败（可能未部署云函数），已切换为模拟登录模式以便演示。',
      showCancel: false,
      success: () => {
        wx.setStorageSync('openid', 'test-openid-mock');
        this.setData({ isLogin: true });
        this.getRecentOrders();
      }
    });
  },

  getRecentOrders: function() {
    // 获取最近订单，应调用云数据库
    // 模拟数据
    this.setData({
      recentOrders: [
        { id: '1001', type: '预约场馆', status: '已完成', time: '2023-10-27 12:00', amount: 15.0 },
        { id: '1002', type: '故障报修', status: '处理中', time: '2023-10-26 15:30', desc: '宿舍灯坏了' }
      ]
    });
  },

  onServiceTap: function(e) {
    if (!this.data.isLogin) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const item = e.currentTarget.dataset.item;
    console.log('点击服务', item.name);
    
    if (item.name === '食堂订餐') {
      wx.navigateTo({
        url: '/pages/service/canteen/index'
      });
    } else if (item.name === '场馆预约') {
      wx.navigateTo({
        url: '/pages/service/venue/index'
      });
    } else {
      wx.showToast({ title: '功能开发中...', icon: 'none' });
    }
  }
})