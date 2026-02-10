Page({
  data: {
    news: null,
    loading: true
  },

  onLoad: function (options) {
    if (options.id) {
      this.getNewsDetail(options.id);
    }
  },

  getNewsDetail: async function(id) {
    try {
      const app = getApp();
      const res = await app.callContainer(`/api/news/${id}`, 'GET');
      if (res) {
        this.setData({
          news: {
            ...res,
            date: res.publishDate ? res.publishDate.substring(0, 10) : ''
          },
          loading: false
        });
      }
    } catch (err) {
      console.error('获取资讯详情失败', err);
      wx.showToast({
        title: '获取详情失败',
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  },

  onShareAppMessage: function () {
    if (this.data.news) {
      return {
        title: this.data.news.title,
        path: `/pages/community/news/detail/index?id=${this.data.news.id}`
      };
    }
  }
})