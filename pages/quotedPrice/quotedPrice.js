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
      [],
      []
    ],
    objectMultiArray: [],
    multiIndex: [0, 0],
    server:[0, 1],
    date: new Date().toLocaleDateString(),
    today: new Date().toLocaleDateString(),
    DealImageUrl:'',
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
    var regionList = this.data.regionList;
    var serviceList = this.data.serviceList;
    var select_key = e.detail.value[1];
      this.setData({
        service_id: serviceList[select_key].service_id　　　　　　// service_id 代表着选择的服务器对应的 班级id
      })
    this.setData({
      multiIndex: e.detail.value,
      server: [this.data.region_id, this.data.service_id]
    })
    console.log(this.data.server)
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    var region_id_session = this.data.region_id;　　　　// 保持之前的大区id 与新选择的id 做对比，如果改变则重新请求数据
    switch (e.detail.column) {
      case 0:
        var regionList = this.data.regionList;
        var region_id = regionList[e.detail.value].region_id;
        if (region_id_session != region_id) {　　　　// 与之前保持的大区id做对比，如果不一致则重新请求并赋新值
          this.searchService(region_id);
          data.region_id = region_id
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
          //uploadTask.abort() // 取消上传任务
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
    var obj = e.detail.value
    if (obj.productName ==""){
      util.showModel('提示', '请填写物品名称')
      return;
    }
    if (obj.productPrice == "") {
      util.showModel('提示', '请填写物品价格')
      return;
    }
    var imageSrc = self.data.imageList[0]
    if(imageSrc)
    {
      self.setData({
        loading: true
      })
      util.showBusy('上传图片中...')
      const uploadTask = wx.uploadFile({
        url: config.service.uploadUrl, //仅为示例，非真实的接口地址
        filePath: imageSrc,
        name: 'file',
        success: function (res) {
          //do something
          //util.showSuccess('图片上传成功')
          console.log(res)
          var _data = JSON.parse(res.data)
          var _data_imgUrl = _data[0];
          console.log(_data_imgUrl)
          self.setData({
            DealImageUrl: _data_imgUrl.imgUrl
          })
          e.detail.value.dealImageUrl = _data_imgUrl.imgUrl
          console.log(e.detail.value)
          //提交表单
          wx.request({
            url: config.service.quotedPrice,
            method: 'POST',
            data: e.detail.value,
            success: res2 => {
              self.setData({
                loading: false
              })
              if (res2.statusCode == 201) {
                util.showSuccess('提交成功')
                console.log(res2)
              } else {
                util.showModel("提交失败", res2.data.Message)
              }
            },
            fail: function (message) {
              util.showModel("提交失败", message)
            }
          })
        }
      })
      uploadTask.onProgressUpdate((res) => {
        self.setData({
          percent: res.progress
        })
        console.log('上传进度', res.progress)
        console.log('已经上传的数据长度', res.totalBytesSent)
        console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
      })
    }else{
      util.showModel('提示','请选择交易截图')
    }
  },
  searchService(region_id) {
    var that = this;
    if (region_id >= 0) {
      this.setData({
        region_id: region_id
      })
      var url = config.service.getService;
      wx.request({
        url: config.service.getService,
        data: {
          region_id: region_id
        },
        success: res => {
          var serviceList = res.data;
          console.log(serviceList);
          var serviceArr = serviceList.map(item => {
            return item.service_nickname;
          })
          var regionArr = this.data.regionArr;
          that.setData({
            multiArray: [regionArr, serviceArr],
            serviceArr,
            serviceList
          })
        }
      })
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
    var that = this;
    that.getUserInfo();
    wx.request({
      url: config.service.getRegion,
      data: {},
      success: res => {
        var regionList = res.data;
        console.log(regionList)
        var regionArr = regionList.map(item => {　　　　// 此方法将大区名称区分到一个新数组中
          return item.region_name;
        });
        that.setData({
          multiArray: [regionArr, []],
          regionList,
          regionArr
        })
        var default_region_id = regionList[0]['region_id'];　　　　//获取默认的大区对应的 region_id
        if (default_region_id >= 0) {
          that.searchService(default_region_id)　　　　　　// 如果存在调用获取对应的服务器数据
        }
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