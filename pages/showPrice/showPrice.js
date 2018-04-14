// pages/showPrice/showPrice.js
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quotes:[],
    query:[]
  },
  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var quotes = JSON.parse(options.quotes)
    var query = JSON.parse(options.query)
    
    this.setData({
        quotes:quotes,
        query: query
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.showToast({
      title: '数据刷新中...',
      icon: 'loading'
    })
    console.log('onPullDownRefresh', new Date())
    wx.request({
      url: config.service.getPriceUrl,
      data: that.data.query,
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          console.log(res.data)
          that.setData({
            quotes: res.data
          })
        }
        wx.stopPullDownRefresh({
          complete: function (res) {
            // wx.hideToast()
            console.log(res, new Date())
          }
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '报价列表',
      path: '/pages/showPrice/showPrice',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})