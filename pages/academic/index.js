const app = getApp();

Page({
  data: {
    isLogin: false,
    timetable: [],
    scores: [],
    academicFunctions: [
      { name: '考试安排', icon: '📝', path: '/pages/academic/exams/index' },
      { name: '作业管理', icon: '📘', path: '/pages/academic/homework/index' },
      { name: '教学评价', icon: '⭐', path: '/pages/academic/evaluation/index' },
      { name: '图书馆', icon: '📚', path: '/pages/academic/library/index' },
      { name: '在线选课', icon: '👆', path: '/pages/academic/course-select/index' }
    ]
  },

  onShow: function () {
    this.checkLoginStatus();
  },

  
  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    
    if (openid && userInfo) {
      this.setData({ 
        isLogin: true,
        userInfo: userInfo
      });
    } else {
      this.setData({ isLogin: false });
    }
  },
  // checkLoginStatus: function() {
    
  //   // 检查是否有用户信息，这里简单判断 storage 中是否有 openid
  //   const openid = wx.getStorageSync('openid');
  //   if (openid) {
  //     this.setData({ isLogin: true });
  //     this.getAcademicData();
  //   } else {
  //     this.setData({ isLogin: false });
  //   }
  // },
doLogin:function(){
  wx.switchTab({
    url:'/pages/profile/index'
  })
},
  // doLogin: function() {
  //   wx.showLoading({ title: '登录中...' });
  //   wx.cloud.callFunction({
  //     name: 'getOpenId',
  //     success: res => {
  //       wx.hideLoading();
  //       if (res.result && res.result.openid) {
  //         wx.setStorageSync('openid', res.result.openid);
  //         this.setData({ isLogin: true });
  //         this.getAcademicData();
  //         wx.showToast({ title: '登录成功' });
  //       } else {
  //         console.error('登录失败：无 openid', res);
  //         this.fallbackLogin();
  //       }
  //     },
  //     fail: err => {
  //       console.error('云函数调用失败', err);
  //       wx.hideLoading();
  //       // 降级处理：如果云函数调用失败（如未部署），则使用模拟数据登录
  //       this.fallbackLogin();
  //     }
  //   });
  // },

  // fallbackLogin: function() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '云登录失败（可能未部署云函数），已切换为模拟登录模式以便演示。',
  //     showCancel: false,
  //     success: () => {
  //       wx.setStorageSync('openid', 'test-openid-mock');
  //       this.setData({ isLogin: true });
  //       this.getAcademicData();
  //     }
  //   });
  // },

  onFunctionTap: function(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({ url: path });
    }
  },

  getAcademicData: async function() {
    // 1. 获取成绩 (模拟)
    this.setData({
      scores: [
        { id: 1, name: '计算机基础', score: 95 },
        { id: 2, name: '线性代数', score: 88 }
      ]
    });

    // 2. 获取今日课表
    try {
      const res = await app.callContainer('/api/courses', 'GET');
      if (res) {
        const today = new Date().getDay() || 7; // 1-7
        const todayCourses = res.filter(c => c.dayOfWeek == today);
        
        // Sort by start time
        todayCourses.sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
        });

        const timetable = todayCourses.map(c => ({
            id: c.id,
            name: c.name,
            time: `${c.startTime} - ${c.endTime}`,
            location: c.location
        }));
        this.setData({ timetable });
      }
    } catch (err) {
      console.error('获取课表失败', err);
      // 失败时保持空或显示错误
      this.setData({ timetable: [] });
    }
  }
})