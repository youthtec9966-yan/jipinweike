const app = getApp();

Page({
  data: {
    exams: []
  },

  onLoad: function (options) {
    this.getExams();
  },

  getExams: async function() {
    try {
      const list = await app.callContainer('/api/exams', 'GET');
      if (list) {
        const exams = list.map(item => ({
          id: item.id,
          name: item.name,
          type: item.type || '期末',
          time: `${item.examDate} ${item.startTime}-${item.endTime}`,
          location: item.location || '',
          seat: item.seat || ''
        }));
        this.setData({ exams });
      }
    } catch (err) {
      console.error('获取考试安排失败', err);
      wx.showToast({ title: '获取考试安排失败', icon: 'none' });
    }
  }
})
