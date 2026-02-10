Page({
  data: {
    items: []
  },

  onLoad: function (options) {
    this.getItems();
  },

  getItems: async function() {
    try {
      const app = getApp();
      const res = await app.callContainer('/api/posts', 'GET', { type: 'second_hand' });
      const items = res.map(item => ({
        ...item,
        cover: (item.images && item.images.length > 0) ? item.images[0] : '',
        seller: item.authorName || '匿名',
        tag: '二手' // 暂时统一显示为二手
      }));
      this.setData({ items });
    } catch (err) {
      console.error('获取二手商品失败，使用模拟数据', err);
      // 模拟数据
      this.setData({
        items: [
          { 
            id: 1, 
            title: '99新 罗技机械键盘 (模拟数据)', 
            price: 150, 
            cover: 'https://images.unsplash.com/photo-1587829741301-dc798b91add1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            seller: '张同学',
            tag: '数码'
          },
          { 
            id: 2, 
            title: '考研英语词汇书 (模拟数据)', 
            price: 20, 
            cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            seller: '李同学',
            tag: '书籍'
          },
          { 
            id: 3, 
            title: '宿舍用小风扇 (模拟数据)', 
            price: 15, 
            cover: 'https://images.unsplash.com/photo-1565622254376-77e774c44243?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            seller: '王同学',
            tag: '生活'
          }
        ]
      });
    }
  },

  onItemTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/detail/index?id=${id}`
    });
  },

  onPost: function() {
    wx.navigateTo({
      url: '/pages/community/post/index?type=second_hand'
    });
  }
})