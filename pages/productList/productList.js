// pages/productList/productList.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    products:[],
    _products:[],
    array: ['全部','头发', '盒子', '衣服', '披风', '其他'],
    index: 0
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var tname = this.data.array[e.detail.value]
    console.log(tname)
    this.setData({
      index: e.detail.value
    })
    if (tname=='全部')
    {
      this.setData({
        _products: this.data.products
      })
    }else{
      var _products=[]
      this.data.products.map(function (currentValue, index){
        if (currentValue.ExteriorName==tname){
          _products.push(currentValue)
        }
      })
      this.setData({
        _products: _products
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: config.service.getProduct,
      data:{},
      success: res=> {
        console.log(res.data)
        that.setData({
          products:res.data,
          _products: res.data
        })
      }
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
    
  }
})