// pages/quotedPrice/quotedPrice.js
var config = require('../../config')
var util = require('../../utils/util.js')
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
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
    imgUrl:'',
    imageList: [],
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    sizeType: ['压缩', '原图', '压缩或原图'],

    // countIndex: 8,
    // count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    countIndex: 0,
    count: [1]
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
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
  chooseImage: function () {
    var that = this
    wx.chooseImage({
      sourceType: sourceType[this.data.sourceTypeIndex],
      sizeType: sizeType[this.data.sizeTypeIndex],
      count: this.data.count[this.data.countIndex],
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: res.tempFilePaths
        })
      }
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src

    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var self = this
    var imageSrc = self.data.imageList[0]
    if(imageSrc)
    {
      self.setData({
        loading: true
      })

      util.showBusy('上传图片中...')
      // 上传图片
      wx.uploadFile({
        url: config.service.uploadUrl,
        filePath: imageSrc,
        name: 'file',

        success: function (res) {
          util.showSuccess('上传图片成功')
          console.log(res)
          res = JSON.parse(res.data)
          console.log(res)
          self.setData({
            imgUrl: res.data.imgUrl
          })

          util.showBusy('表单提交中...')
          //提交表单
          wx.request({
            url: config.service.quotedPrice,
            data: {

            },
            success: res => {
              self.setData({
                loading: false
              })
              util.showSuccess('提交成功')
            },
            fail: function () {

            }
          })
        },

        fail: function (e) {
          util.showModel('上传图片失败', e)
        }
      })
    }else{
      util.showModel('提示','请选择交易截图')
    }
  },
  getUserInfo: function () {
    var that = this

    if (app.globalData.hasLogin === false) {
      wx.login({
        success: _getUserInfo
      })
    } else {
      _getUserInfo()
    }

    function _getUserInfo() {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            hasUserInfo: true,
            userInfo: res.userInfo
          })
          that.update()
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
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