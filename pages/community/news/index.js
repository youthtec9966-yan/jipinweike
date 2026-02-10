Page({
  data: {
    newsList: []
  },

  onLoad: function (options) {
    this.getNews();
  },

  getNews: async function() {
    try {
      const app = getApp();
      const res = await app.callContainer('/api/news');
      const newsList = res.map(item => ({
        ...item,
        date: item.publishDate ? item.publishDate.substring(0, 10) : '',
        tag: this.formatType(item.type)
      }));
      this.setData({ newsList });
    } catch (err) {
      console.error('获取资讯失败，使用模拟数据', err);
      // 模拟数据
      this.setData({
        newsList: [
          {
            id: 1,
            title: '关于2026年劳动节放假的通知 (模拟数据)',
            date: '2026-04-25',
            readCount: 1256,
            tag: '通知',
            cover: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          },
          {
            id: 2,
            title: '学校图书馆关于调整开馆时间的公告 (模拟数据)',
            date: '2026-04-20',
            readCount: 892,
            tag: '公告',
            cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          },
          {
            id: 3,
            title: '第十届校园歌手大赛决赛名单公布 (模拟数据)',
            date: '2026-04-18',
            readCount: 3421,
            tag: '资讯',
            cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          }
        ]
      });
    }
  },

  formatType: function(type) {
    const map = {
      'notice': '通知',
      'news': '资讯',
      'announcement': '公告'
    };
    return map[type] || '资讯';
  },

  onNewsTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/news/detail/index?id=${id}`
    });
  }
})
