Page({
  data: {
    clubList: []
  },

  onLoad: function (options) {
    this.getClubs();
  },

  getClubs: async function() {
    try {
      const app = getApp();
      const res = await app.callContainer('/api/clubs');
      const clubList = res.map(item => ({
        ...item,
        desc: item.description
      }));
      this.setData({ clubList });
    } catch (err) {
      console.error('获取社团失败，使用模拟数据', err);
      // 模拟数据
      this.setData({
        clubList: [
          {
            id: 1,
            name: '吉他社 (模拟数据)',
            category: '艺术类',
            memberCount: 156,
            desc: '用音乐点亮生活，吉他社期待你的加入！每周五晚草坪音乐会。',
            logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
          },
          {
            id: 2,
            name: '计算机协会 (模拟数据)',
            category: '科技类',
            memberCount: 203,
            desc: '代码改变世界。定期举办编程讲座、黑客马拉松。',
            logo: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
          },
          {
            id: 3,
            name: '摄影协会 (模拟数据)',
            category: '艺术类',
            memberCount: 128,
            desc: '定格美好瞬间。提供专业摄影器材借用，定期外拍活动。',
            logo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
          },
          {
            id: 4,
            name: '篮球社 (模拟数据)',
            category: '体育类',
            memberCount: 345,
            desc: '无兄弟，不篮球！校内最大的体育社团。',
            logo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
          }
        ]
      });
    }
  },

  onClubTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '进入社团主页',
      icon: 'none'
    });
  },

  onJoinTap: function(e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({
      title: '申请加入 ' + name,
      icon: 'none'
    });
  }
})
