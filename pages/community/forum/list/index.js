Page({
  data: {
    category: '',
    posts: []
  },
  onLoad(options) {
    if (options.category) {
      this.setData({ category: options.category });
      wx.setNavigationBarTitle({ title: options.category });
      this.getPosts(options.category);
    }
  },
  async getPosts(category) {
    try {
      const app = getApp();
      const rawPosts = await app.callContainer('/api/posts', 'GET', { type: 'forum', category });
      const posts = rawPosts.map(item => ({
        ...item,
        createdAt: this.formatTime(item.createdAt)
      }));
      this.setData({ posts });
    } catch (err) {
      console.error('Fetch posts failed', err);
      // Fallback mock data
      this.setData({
        posts: [
          {
            id: 999,
            authorName: '模拟用户',
            content: '这是一个模拟帖子，因为获取数据失败。',
            createdAt: '刚刚'
          }
        ]
      })
    }
  },

  formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return hours + '小时前';
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  },

  onPostTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/detail/index?id=${id}`
    });
  },
  onFabTap() {
    wx.navigateTo({
      url: '/pages/community/post/index?type=forum'
    });
  }
})