Page({
  data: {
    books: []
  },

  onLoad: function (options) {
    this.getBooks();
  },

  getBooks: function() {
    this.setData({
      books: [
        { id: 1, title: '深入理解计算机系统', author: 'Randal E. Bryant', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', returnDate: '2026-06-01', daysLeft: 5 },
        { id: 2, title: 'JavaScript高级程序设计', author: 'Nicholas C. Zakas', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', returnDate: '2026-06-15', daysLeft: 19 }
      ]
    });
  },

  onSearch: function() {
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  }
})