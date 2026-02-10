Page({
  data: {
    banners: [],
    announcements: [],
    newsList: [],
    // 快捷入口 (金刚区)
    shortcuts: [
      { name: '课表查询', icon: '📅', path: '/pages/academic/schedule/index' },
      { name: '成绩查询', icon: '📊', path: '/pages/academic/index' },
      { name: '一卡通', icon: '💳', path: '/pages/service/index' },
      { name: '校车', icon: '🚌', path: '/pages/service/index' },
    ],
    // 院系数据
    departments: [
      { id: 1, name: '计算机学院', desc: 'Computer Science', icon: '💻', color: '#E3F2FD' },
      { id: 2, name: '艺术学院', desc: 'Art & Design', icon: '🎨', color: '#FCE4EC' },
      { id: 3, name: '经管学院', desc: 'Business', icon: '📈', color: '#E8F5E9' },
      { id: 4, name: '外语学院', desc: 'Foreign Languages', icon: '🗣', color: '#FFF3E0' },
      { id: 5, name: '建筑学院', desc: 'Architecture', icon: '🏛', color: '#F3E5F5' },
    ],
    // AI Chat State
    showChat: false,
    inputVal: '',
    isAiTyping: false,
    scrollIntoView: '',
    chatMessages: [
      { role: 'ai', content: '你好！我是校园AI助手，可以问我关于课程、校车、食堂或活动的问题哦~' }
    ]
  },

  onLoad: function (options) {
    this.getHomeData();
  },

  // AI Chat Methods
  toggleChat: function() {
    this.setData({
      showChat: !this.data.showChat
    });
  },

  preventTouchMove: function() {}, // 阻止底层滚动

  onChatInput: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  sendChatMessage: function() {
    const content = this.data.inputVal.trim();
    if (!content) return;

    const newMsg = { role: 'user', content };
    const messages = [...this.data.chatMessages, newMsg];

    this.setData({
      chatMessages: messages,
      inputVal: '',
      scrollIntoView: `msg-${messages.length - 1}`,
      isAiTyping: true
    });

    // 模拟AI回复
    setTimeout(() => {
      this.getAiResponse(content);
    }, 1000);
  },

  getAiResponse: async function(query) {
    const app = getApp();
    let reply = '';
      
      try {
        const res = await app.callContainer('/api/ai/chat', 'POST', { query });
        // app.js 中的 callContainer 已经处理了 code===0 的判断
        // 并直接返回了 data 字段（即 AI 回复的内容字符串）
        // 如果出错，callContainer 会抛出异常，直接进入 catch
        
        if (res) {
          reply = res;
        }
      } catch (err) {
        console.error('AI Chat Error', err);
        let errorMsg = '抱歉，我现在有点累，请稍后再试。';
        if (err.message && err.message.includes('-501000')) {
          errorMsg = '系统配置错误：未找到云托管服务，请联系管理员检查服务名称配置。';
        }
        reply = errorMsg + '（' + (err.message || '未知错误') + '）';
      }

      // 开始流式输出（打字机效果）
      const aiMsg = { role: 'ai', content: '' };
      const messages = [...this.data.chatMessages, aiMsg];
      const aiMsgIndex = messages.length - 1;

      this.setData({
        chatMessages: messages,
        isAiTyping: false
      });

      let i = 0;
      const typeWriter = () => {
        if (i < reply.length) {
          // 每次追加 2 个字符以加快显示速度，避免过长文本太慢
          const chunk = reply.slice(i, i + 2);
          const currentContent = this.data.chatMessages[aiMsgIndex].content;
          
          this.setData({
            [`chatMessages[${aiMsgIndex}].content`]: currentContent + chunk,
            scrollIntoView: `msg-${aiMsgIndex}` // 保持滚动到底部
          });
          
          i += 2;
          setTimeout(typeWriter, 30); // 30ms 间隔
        } else {
          // 完成后确保全部显示（处理奇数长度）
          if (this.data.chatMessages[aiMsgIndex].content.length < reply.length) {
            this.setData({
              [`chatMessages[${aiMsgIndex}].content`]: reply,
              scrollIntoView: `msg-${aiMsgIndex}`
            });
          }
        }
      };

      typeWriter();
  },

  getHomeData: async function() {
    const app = getApp();
    
    try {
      // 1. 获取轮播图
      const bannerRes = await app.callContainer('/api/carousels', 'GET');
      if (bannerRes && bannerRes.length > 0) {
        this.setData({ banners: bannerRes });
      }

      // 2. 获取资讯/公告
      // 这里后端 /api/admin/news 返回的是所有，我们可能需要一个公开接口
      // 暂时复用 /api/admin/news 但实际应该用 /api/news (需要新建)
      // 假设我们先用 /api/admin/news (生产环境应拆分)
      const newsRes = await app.callContainer('/api/admin/news', 'GET');
      
      if (newsRes && newsRes.length > 0) {
        // 过滤出公告 (type=announcement)
        const announcements = newsRes.filter(item => item.type === 'announcement' || item.type === 'notice');
        // 过滤出资讯 (type=news)
        const newsList = newsRes.filter(item => item.type === 'news');

        this.setData({
          announcements: announcements.length ? announcements : [],
          newsList: newsList.map(item => ({
            ...item,
            date: item.publishDate ? item.publishDate.substring(5, 10) : '',
            coverUrl: item.cover,
            viewCount: item.readCount
          }))
        });
      }
    } catch (err) {
      console.error('获取首页数据失败', err);
      // 失败时不覆盖默认数据或显示错误提示
    }
  },

  onBannerTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const banner = this.data.banners[index];
    if (banner && banner.link) {
      // 如果是http开头，可能是外部链接，需要webview（暂不处理，假设是内部路径）
      if (banner.link.startsWith('/')) {
        wx.navigateTo({
          url: banner.link,
          fail: (err) => {
            // 如果是tabBar页面，使用switchTab
            wx.switchTab({
              url: banner.link,
              fail: () => {
                 console.error('跳转失败', err);
              }
            });
          }
        });
      }
    }
  },

  onShortcutTap: function(e) {
    const path = e.currentTarget.dataset.path;
    // 判断是否是 TabBar 页面
    const isTabBar = path === '/pages/academic/index' || path === '/pages/service/index';
    
    if (isTabBar) {
        wx.switchTab({ url: path });
    } else {
        wx.navigateTo({ url: path });
    }
  },

  onNewsTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/community/news/detail/index?id=${id}`
    });
  },

  onAnnouncementTap: function(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
        wx.navigateTo({
            url: `/pages/community/news/detail/index?id=${id}`
        });
    }
  },

  onDepartmentTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '点击了院系: ' + id,
      icon: 'none'
    });
    // 后续可以跳转到院系详情页
  }
})