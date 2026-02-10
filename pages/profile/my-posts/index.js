Page({
  data: {
    posts: [],
    loading: true
  },

  onLoad: function (options) {
    this.getMyPosts();
  },

  getMyPosts: async function() {
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
      this.setData({ loading: false });
      return;
    }

    try {
      const app = getApp();
      const res = await app.callContainer('/api/posts', 'GET', { authorId: openid });
      
      // res 应该是数组
      if (res) {
        this.setData({
          posts: res.map(item => ({
            ...item,
            createTime: item.createdAt ? item.createdAt.substring(0, 16).replace('T', ' ') : '',
            commentCount: 0 // 暂时无评论数
          })),
          loading: false
        });
      }
    } catch (err) {
      console.error(err);
      this.setData({ loading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  onPostTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/detail/index?id=${id}`
    });
  }
})