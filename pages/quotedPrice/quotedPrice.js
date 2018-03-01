// pages/quotedPrice/quotedPrice.js
var config = require('../../config')
var util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: ['出了', '淘宝价出了', '低于市价出了', '收了', '淘宝价收了', '低于市价收了'],
    objectArray: [
      {
        id: 0,
        name: '出了'
      },
      {
        id: 1,
        name: '淘宝价出了'
      },
      {
        id: 2,
        name: '低于市价出了'
      },
      {
        id: 3,
        name: '收了'
      },
      {
        id: 4,
        name: '淘宝价收了'
      },
      {
        id: 5,
        name: '低于市价收了'
      }
    ],
    index: 0,
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
    imgUrl: 'http://image.ijq.tv/201512/12/22-42-30-55-1.jpg',
    sresult: {}
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
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
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败', e)
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var self = this
    self.setData({
      loading: true
    })
    wx.request({
      url: '',
      data:{

      },
      success:res=>{
        self.setData({
          loading: false
        })
      },
      fail:function(){
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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