const app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: {},
    stats: {
      postCount: 0,
      likeCount: 0,
      activityCount: 0
    },
    menuGroups: [
      {
        title: '我的社区',
        items: [
          { id: 'posts', title: '我的发布', icon: '📝', path: '/pages/profile/my-posts/index' },
          { id: 'activities', title: '我的活动', icon: '🚩', path: '/pages/profile/my-activities/index' },
          { id: 'collections', title: '我的收藏', icon: '⭐', path: '/pages/profile/collections/index' }
        ]
      },
      {
        title: '校园服务',
        items: [
          { id: 'verify', title: '身份认证', icon: '🎓', path: '/pages/profile/verify/index' },
          { id: 'feedback', title: '意见反馈', icon: '✉️', path: '/pages/profile/feedback/index' }
        ]
      },
      {
        title: '系统',
        items: [
          { id: 'about', title: '关于我们', icon: 'ℹ️', path: '/pages/profile/about/index' },
          { id: 'settings', title: '设置', icon: '⚙️', path: '/pages/profile/settings/index' }
        ]
      }
    ],
    showLoginModal: false,
    tempAvatarUrl: '',
    tempNickname: ''
  },

  onShow: function () {
    this.checkLoginStatus();
    if (this.data.isLogin) {
      this.fetchUserStats();
    }
  },

  fetchUserStats: function() {
    // 模拟获取用户统计数据
    this.setData({
      stats: {
        postCount: 12,
        likeCount: 56,
        activityCount: 3
      }
    });
  },

  checkLoginStatus: function() {
    const userInfo = wx.getStorageSync('userInfo');
    const openid = wx.getStorageSync('openid');
    
    if (openid && userInfo) {
      this.setData({ 
        isLogin: true,
        userInfo: userInfo
      });
    } else {
      this.setData({ isLogin: false });
    }
  },

  onLogout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('openid');
          this.setData({
            isLogin: false,
            userInfo: {},
            stats: { postCount: 0, likeCount: 0, activityCount: 0 }
          });
          wx.showToast({ title: '已退出', icon: 'none' });
        }
      }
    });
  },

  doLogin: function() {
    this.setData({ showLoginModal: true });
  },

  closeLoginModal() {
    this.setData({ showLoginModal: false });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({ tempAvatarUrl: avatarUrl });
  },

  onNicknameChange(e) {
    this.setData({ tempNickname: e.detail.value });
  },

  async submitLogin() {
    const { tempAvatarUrl, tempNickname } = this.data;
    if (!tempAvatarUrl) return wx.showToast({ title: '请选择头像', icon: 'none' });
    if (!tempNickname) return wx.showToast({ title: '请输入昵称', icon: 'none' });

    wx.showLoading({ title: '登录中...' });

    try {
      // 1. 上传头像到云存储
      const cloudPath = `avatars/${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath,
        filePath: tempAvatarUrl
      });
      const fileID = uploadRes.fileID;

      // 2. 获取 OpenID (通过云函数或后端接口)
      // 这里简化直接调云函数 getOpenId，如果没有则使用 mock
      let openid = wx.getStorageSync('openid');
      if (!openid) {
        try {
          const res = await wx.cloud.callFunction({ name: 'getOpenId' });
          openid = res.result.openid;
          wx.setStorageSync('openid', openid);
        } catch (e) {
          console.error('获取OpenID失败，使用模拟ID', e);
          openid = 'test-openid-' + Date.now();
          wx.setStorageSync('openid', openid);
        }
      }

      // 3. 提交用户信息到后端数据库
      const app = getApp();
      const userRes = await app.callContainer('/api/user/update', 'POST', {
        nickname: tempNickname,
        avatarUrl: fileID, // 存储 fileID，前端展示时需要换取临时链接或直接使用(如果是fileID支持的组件)
        // 注意：Web端无法直接访问 fileID，最好后端转为 HTTP URL 或前端换取
        // 这里简单起见先存 fileID，实际展示可能需要 image src 支持
      });

      // 如果后端返回了完整 user 对象
      const newUserInfo = {
        nickName: tempNickname,
        avatarUrl: tempAvatarUrl, // 本地先展示临时的
        studentId: userRes.data?.studentId || '未认证',
        department: userRes.data?.department || '未认证'
      };

      wx.setStorageSync('userInfo', newUserInfo);
      this.setData({
        isLogin: true,
        userInfo: newUserInfo,
        showLoginModal: false
      });

      wx.hideLoading();
      wx.showToast({ title: '登录成功' });

    } catch (err) {
      console.error(err);
      wx.hideLoading();
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  onMenuTap: function(e) {
    if (!this.data.isLogin) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      return;
    }
    const path = e.currentTarget.dataset.path;
    const id = e.currentTarget.dataset.id;

    if (id === 'settings') {
        // 简单处理，如果是设置且没做页面，就直接用ActionSheet演示退出
        wx.showActionSheet({
            itemList: ['退出登录'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    this.onLogout();
                }
            }
        });
        return;
    }

    if (path) {
        wx.navigateTo({
            url: path,
            fail: () => {
                wx.showToast({
                    title: '功能开发中',
                    icon: 'none'
                });
            }
        });
    }
  }
})