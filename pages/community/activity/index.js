Page({
  data: {
    activities: []
  },

  onLoad: function (options) {
    this.getActivities();
  },

  getActivities: async function() {
    try {
      const app = getApp();
      const res = await app.callContainer('/api/activities');
      const activities = res.map(item => ({
        ...item,
        time: item.startTime ? item.startTime.substring(0, 16).replace('T', ' ') : '',
        status: this.formatStatus(item.status)
      }));
      this.setData({ activities });
    } catch (err) {
      console.error('获取活动失败，使用模拟数据', err);
      // 模拟数据
      this.setData({
        activities: [
          { 
            id: 1, 
            title: '第十届“创新杯”科技文化节 (模拟数据)', 
            cover: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            time: '2026-05-20 14:00', 
            location: '大学生活动中心', 
            organizer: '校团委',
            status: '报名中'
          },
          { 
            id: 2, 
            title: '吉他社草坪音乐会 (模拟数据)', 
            cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            time: '2026-05-22 19:00', 
            location: '南操场', 
            organizer: '吉他社',
            status: '进行中'
          }
        ]
      });
    }
  },

  formatStatus: function(status) {
    const map = {
      'recruiting': '报名中',
      'ongoing': '进行中',
      'ended': '已结束'
    };
    return map[status] || status;
  },

  onApply: function(e) {
    wx.showToast({ title: '报名成功', icon: 'success' });
  }
})