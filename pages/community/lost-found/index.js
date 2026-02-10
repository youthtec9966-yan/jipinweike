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
      // 并发请求失物和招领
      const [lostRes, foundRes] = await Promise.all([
        app.callContainer('/api/posts', 'GET', { type: 'lost_found' }),
        app.callContainer('/api/posts', 'GET', { type: 'found' })
      ]);
      
      const formatItem = (item) => ({
        ...item,
        type: item.type === 'lost_found' ? 'lost' : 'found',
        desc: item.content,
        time: item.createdAt ? this.formatTime(item.createdAt) : ''
      });

      const items = [...lostRes.map(formatItem), ...foundRes.map(formatItem)];
      // 按时间倒序排序
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      this.setData({ items });
    } catch (err) {
      console.error('获取失物招领失败，使用模拟数据', err);
      // 模拟数据
      this.setData({
        items: [
          { 
            id: 1, 
            type: 'lost',
            title: '寻物启事：丢失黑色钱包 (模拟数据)', 
            desc: '5月20日在二教301教室丢失黑色钱包一个，内有身份证、校园卡，拾到者请联系...',
            time: '2小时前',
            contact: '138****1234'
          },
          { 
            id: 2, 
            type: 'found',
            title: '招领：捡到AirPods耳机 (模拟数据)', 
            desc: '在南操场看台捡到AirPods耳机一个，请失主凭连接记录认领。',
            time: '5小时前',
            contact: 'QQ: 123456'
          }
        ]
      });
    }
  },

  formatTime: function(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return '刚刚';
    if (hours < 24) return hours + '小时前';
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  },

  onItemTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/detail/index?id=${id}`
    });
  },

  onPost: function() {
    wx.navigateTo({
      url: '/pages/community/post/index?type=lost_found'
    });
  }
})