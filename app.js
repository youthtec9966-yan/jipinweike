// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'prod-8g8fm7yj7ad35351',
        traceUser: true,
      });
    }

    this.globalData = {};
  },

  // 封装云托管调用
  callContainer: async function(path, method = 'GET', data = {}) {
    try {
      const res = await wx.cloud.callContainer({
        config: {
          env: 'prod-8g8fm7yj7ad35351'
        },
        path: path,
        header: {
          'X-WX-SERVICE': 'express-vbnc', 
          'content-type': 'application/json'
        },
        method: method,
        data: data
      });
      if (res.statusCode === 200 && res.data.code === 0) {
        return res.data.data;
      }
      throw new Error(res.data.error || '请求失败');
    } catch (err) {
      console.error('云托管调用失败', err);
      // 检查是否为服务未找到错误
      if (err.message && err.message.includes('-501000')) {
        console.error('【严重错误】未找到云托管服务，请检查 app.js 中的 "X-WX-SERVICE" 是否填写正确，以及服务是否已部署。');
      }
      throw err;
    }
  }
});
