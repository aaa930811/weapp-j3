// pages/nba/nba.js
Page({
  data: {
   nbanews:{}
  },

  onLoad: function () {
    var that = this;
    wx.request({
      url: 'https://op.juhe.cn/onebox/basketball/nba',
      data:{
        key:'30f90636ba1620b87981bf57d44ef894'
      }, 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          nbanews:res.data.result
        })
        console.log(that.data.nbanews)
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: 'NBA赛事结果',
      path: '/pages/nba/nba',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})

