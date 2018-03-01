// pages/getPrice/getPrice.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      ['电信一区', '电信二区'],
      ['长安城', '龙争虎斗', '扬州城', '枫华谷', '逍遥林']
    ],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '电信一区'
        },
        {
          id: 1,
          name: '电信二区'
        }
      ], [
        {
          id: 0,
          name: '长安城'
        },
        {
          id: 1,
          name: '龙争虎斗'
        },
        {
          id: 2,
          name: '扬州城'
        },
        {
          id: 3,
          name: '枫华谷'
        },
        {
          id: 3,
          name: '逍遥林'
        }
      ]
    ],
    multiIndex: [0, 0],
    date: new Date().toLocaleDateString(),
    today: new Date().toLocaleDateString(),
    sresult: {}
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    // util.showBusy('查询中...')
    
    //ajax获取查询数据
    // var sdata = { data: e.detail.value } 

    //写在ajax的success中
    // util.showSuccess('查询成功完成')
    this.setData({
      multiIndex: e.detail.value,
      // sresult: sdata
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      sresult: this.data.sresult
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['长安城', '龙争虎斗', '扬州城', '枫华谷', '逍遥林'];
            break;
          case 1:
            data.multiArray[1] = ['白帝城', '三才阵', '荻花宫'];
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  doSearch: function (jwarea, jwserver) {
    util.showBusy('查询中...')
    var that = this
    var options = {
      url: config.service.getPriceUrl,
      login: true,
      data: {
        jwarea: jwarea,
        jwserver: jwserver
      },
      success(result) {
        if (result.statusCode == '200') {
          util.showSuccess('查询成功完成')
          console.log('request success', result)
          that.setData({
            sresult: { data: JSON.stringify(result.data) }
          })
        } else {
          util.showModel('查询失败', result.data);
          console.log('request fail', result);
        }
      },
      fail(error) {
        util.showModel('查询失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var self = this

    self.setData({
      loading: true
    })
    wx.request({
      url: config.service.getPriceUrl,
      data:{

      },
      success:res=>{
        self.setData({
          loading: false
        })
        wx.navigateTo({
          url: '../logs/logs'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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