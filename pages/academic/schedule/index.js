const app = getApp();

Page({
  data: {
    weekDays: [],
    times: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
    courseList: []
  },

  onLoad: function (options) {
    this.initWeekDays();
    this.fetchCourses();
  },

  onPullDownRefresh: function() {
    this.fetchCourses();
  },

  initWeekDays: function() {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const now = new Date();
    const currentDay = now.getDay() === 0 ? 7 : now.getDay(); // 1-7
    const oneDayTime = 24 * 60 * 60 * 1000;
    
    // Calculate current week's dates
    // Monday is (currentDay - 1) days ago
    const mondayTime = now.getTime() - (currentDay - 1) * oneDayTime;
    
    const weekDays = days.map((day, index) => {
      const date = new Date(mondayTime + index * oneDayTime);
      const dateStr = (date.getMonth() + 1) + '/' + date.getDate();
      return {
        day: day,
        date: dateStr,
        isToday: (index + 1) === currentDay
      };
    });

    this.setData({ weekDays });
  },

  fetchCourses: async function() {
    try {
      const res = await app.callContainer('/api/courses', 'GET');
      if (res) {
        const processed = res.map(course => {
          // Calculate position
          // Start Time e.g., "08:00" -> 0rpx
          // Each hour is 120rpx
          // Base time is 08:00
          
          const start = this.parseTime(course.startTime);
          const end = this.parseTime(course.endTime);
          const base = this.parseTime('08:00');
          
          const duration = end - start;
          const offset = start - base;
          
          // 1 minute = 2rpx (since 60min = 120rpx)
          const top = offset * 2;
          const height = duration * 2;
          
          return {
            ...course,
            top,
            height,
            color: course.color || this.getStableColor(course.name || String(course.id || 'course'))
          };
        });
        
        this.setData({ courseList: processed });
      }
    } catch (err) {
      console.error('Fetch courses failed', err);
      wx.showToast({ title: '获取课表失败', icon: 'none' });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  parseTime: function(timeStr) {
    // "08:00" -> minutes
    const parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  },
  
  getStableColor: function(key) {
    const hue = this.hashToInt(key) % 360;
    return `hsl(${hue}, 72%, 44%)`;
  },

  hashToInt: function(input) {
    const str = String(input);
    let hash = 5381;
    for (let i = 0; i < str.length; i += 1) {
      hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
      hash = hash >>> 0;
    }
    return hash;
  },

  onCourseTap: function(e) {
    const id = e.currentTarget.dataset.id;
    const course = this.data.courseList.find(c => c.id === id);
    if (course) {
      wx.showModal({
        title: course.name,
        content: `教师: ${course.teacher || '未知'}\n地点: ${course.location || '未知'}\n时间: ${course.startTime}-${course.endTime}`,
        showCancel: false
      });
    }
  }
});
