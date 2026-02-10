Page({
  data: {
    categories: []
  },

  onLoad: function (options) {
    this.getCategories();
  },

  getCategories: function() {
    this.setData({
      categories: [
        { id: 1, name: '学术交流', icon: '📚', desc: '探讨学术问题，分享学习资料', count: 1205 },
        { id: 2, name: '生活趣事', icon: '🎉', desc: '分享生活点滴，记录美好瞬间', count: 3421 },
        { id: 3, name: '表白墙', icon: '💌', desc: '爱要大声说出来', count: 5678 },
        { id: 4, name: '游戏组队', icon: '🎮', desc: '开黑找队友，快乐每一天', count: 890 },
        { id: 5, name: '吐槽大会', icon: '💬', desc: '不吐不快，释放压力', count: 2345 },
        { id: 6, name: '求职招聘', icon: '💼', desc: '兼职实习，就业信息', count: 456 }
      ]
    });
  },

  onCategoryTap: function(e) {
    const name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `/pages/community/forum/list/index?category=${name}`
    });
  }
})
