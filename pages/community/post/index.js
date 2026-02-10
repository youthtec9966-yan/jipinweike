Page({
  data: {
    types: [
      { name: '校园论坛', value: 'forum' },
      { name: '二手交易', value: 'second_hand' },
      { name: '失物招领', value: 'lost_found' },
      { name: '寻物启事', value: 'found' }
    ],
    typeIndex: 0,
    forumCategories: ['学术交流', '生活趣事', '表白墙', '游戏组队', '吐槽大会', '求职招聘'],
    forumCategoryIndex: 0,
    title: '',
    content: '',
    images: [], // 本地临时路径
    price: '',
    contact: '',
    submitting: false
  },

  onLoad(options) {
    if (options.type) {
      const typeIndex = this.data.types.findIndex(t => t.value === options.type);
      if (typeIndex !== -1) {
        this.setData({ typeIndex });
      }
    }
  },

  onTypeChange(e) {
    this.setData({ typeIndex: e.detail.value });
  },

  onForumCategoryChange(e) {
    this.setData({ forumCategoryIndex: e.detail.value });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onPriceInput(e) {
    this.setData({ price: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles.map(f => f.tempFilePath);
        this.setData({
          images: this.data.images.concat(tempFiles)
        });
      }
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({ images });
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.images
    });
  },

  async submitPost() {
    const { types, typeIndex, forumCategories, forumCategoryIndex, title, content, images, price, contact } = this.data;
    
    if (!title.trim()) return wx.showToast({ title: '请输入标题', icon: 'none' });
    if (!content.trim()) return wx.showToast({ title: '请输入内容', icon: 'none' });

    this.setData({ submitting: true });
    wx.showLoading({ title: '发布中...' });

    try {
      // 1. 上传图片到云存储
      const uploadedImages = [];
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const filePath = images[i];
          const cloudPath = `posts/${Date.now()}-${Math.floor(Math.random() * 1000)}${filePath.match(/\.[^.]+?$/)[0]}`;
          
          const uploadRes = await wx.cloud.uploadFile({
            cloudPath,
            filePath
          });
          uploadedImages.push(uploadRes.fileID);
        }
      }

      // 2. 获取用户信息
      const userInfo = wx.getStorageSync('userInfo') || {};

      // 3. 调用发布接口
      const app = getApp();
      const type = types[typeIndex].value;
      const category = type === 'forum' ? forumCategories[forumCategoryIndex] : '';

      await app.callContainer('/api/posts', 'POST', {
        type,
        category,
        title,
        content,
        images: uploadedImages,
        price: type === 'second_hand' ? price : null,
        contact: (type === 'second_hand' || type === 'lost_found' || type === 'found') ? contact : null,
        userInfo: wx.getStorageSync('userInfo')
      });

      wx.hideLoading();
      wx.showToast({ title: '发布成功，待审核', icon: 'success' });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);

    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({ title: '发布失败', icon: 'none' });
      this.setData({ submitting: false });
    }
  }
});
