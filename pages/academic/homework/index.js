Page({
  data: {
    activeTab: 0,
    homeworkList: []
  },

  onLoad: function (options) {
    this.getHomework();
  },

  onTabClick: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
    this.getHomework(); // 实际应根据 tab 筛选
  },

  getHomework: function() {
    // 模拟作业数据
    const allHomework = [
      { id: 1, course: 'Web开发技术', title: '完成小程序首页布局', deadline: '2026-05-25', status: 0 },
      { id: 2, course: '数据库原理', title: 'SQL 查询练习', deadline: '2026-05-28', status: 0 },
      { id: 3, course: '高等数学', title: '第三章习题', deadline: '2026-05-20', status: 1 }
    ];

    const filtered = allHomework.filter(item => item.status === this.data.activeTab);
    this.setData({ homeworkList: filtered });
  }
})