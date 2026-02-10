Page({
  data: {
    post: null
  },

  onLoad: function (options) {
    if (options.id) {
      this.getPostDetail(options.id);
    }
  },

  async getPostDetail(id) {
    wx.showLoading({ title: '加载中' });
    try {
      const app = getApp();
      const res = await app.callContainer(`/api/posts/${id}`);
      
      if (res.code === 404) {
        wx.hideLoading();
        wx.showToast({ title: '帖子不存在', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const post = res.data || res; // 兼容直接返回数据或标准格式 {code:0, data: {}}

      // 处理时间
      if (post.createdAt) {
        post.createdAt = new Date(post.createdAt).toLocaleString();
      }
      // 处理图片
      if (post.images && typeof post.images === 'string') {
        try {
          post.images = JSON.parse(post.images);
        } catch (e) {
          post.images = [];
        }
      }

      this.setData({ post });
      wx.hideLoading();
    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({ title: '加载失败', icon: 'none' });
      // 模拟数据用于演示
      if (id == 1) {
        this.setData({
          post: {
            id: 1,
            authorName: '张三',
            createdAt: '2023/5/20 12:00:00',
            viewCount: 123,
            title: '模拟帖子详情',
            content: '这是一个模拟的帖子详情内容，因为网络请求失败了。',
            images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c'],
            likeCount: 10
          }
        });
      }
    }
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.post.images
    });
  },

  copyContact(e) {
    const contact = e.currentTarget.dataset.contact;
    wx.setClipboardData({
      data: contact,
      success: () => {
        wx.showToast({ title: '已复制联系方式' });
      }
    });
  },

  onLike() {
    // 点赞功能暂未实现
    wx.showToast({ title: '点赞功能开发中', icon: 'none' });
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post ? post.title : '帖子详情',
      path: `/pages/community/detail/index?id=${post.id}`
    };
  }
});
