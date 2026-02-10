Page({
  data: {
    activeTab: 0,
    tabs: [
      { id: 0, name: '动态', path: '' },
      { id: 1, name: '资讯', path: '/pages/community/news/index' },
      { id: 2, name: '论坛', path: '/pages/community/forum/index' },
      { id: 3, name: '活动', path: '/pages/community/activity/index' },
      { id: 4, name: '社团', path: '/pages/community/club/index' },
      { id: 5, name: '二手', path: '/pages/community/second-hand/index' },
      { id: 6, name: '失物', path: '/pages/community/lost-found/index' }
    ],
    posts: []
  },

  onLoad: function (options) {
    this.getPosts();
  },

  onTabClick: function(e) {
    const index = e.currentTarget.dataset.index;
    const tab = this.data.tabs[index];
    if (index === 0) {
      this.setData({ activeTab: 0 });
    } else {
      wx.navigateTo({ url: tab.path });
    }
  },

  onPullDownRefresh: function() {
    this.getPosts();
  },

  getPosts: async function() {
    try {
      const app = getApp();
      // 尝试调用云托管接口 (获取论坛、二手、失物的所有帖子)
      // 后端接口: GET /api/posts
      const posts = await app.callContainer('/api/posts');
      this.setData({ posts: posts });
      wx.stopPullDownRefresh();
    } catch (err) {
      console.error('获取帖子失败，使用模拟数据', err);
      // 模拟数据降级方案
      this.setData({
        posts: [
          {
            id: 1,
            userInfo: { nickName: '张三', avatarUrl: '' },
            content: '今天食堂的红烧肉真好吃！(模拟数据)',
            images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
            createdAt: new Date().getTime(),
            likes: 10,
            comments: 5
          },
          {
            id: 2,
            userInfo: { nickName: '李四', avatarUrl: '' },
            content: '求购二手自行车一辆，有意私聊。(模拟数据)',
            images: [],
            createdAt: new Date().getTime() - 3600000,
            likes: 2,
            comments: 1
          }
        ]
      });
      wx.stopPullDownRefresh();
    }
  },

  onPostTap: function(e) {
    const id = e.currentTarget.dataset.id;
    console.log('点击帖子', id);
    wx.navigateTo({
      url: `/pages/community/detail/index?id=${id}`
    });
  },

  onFabTap: function() {
    // 检查登录
    const openid = wx.getStorageSync('openid');
    if (!openid) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      // 可以在这里触发登录逻辑或者跳转到登录页
     // return;
    }
    wx.navigateTo({
      url: '/pages/community/post/index',
    });
  }
})