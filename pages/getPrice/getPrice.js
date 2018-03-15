// pages/getPrice/getPrice.js
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [
      [],
      []
    ],
    regionArray:[],
    // objectMultiArray: [
    //   [
    //     {
    //       id: 0,
    //       name: '电信一区'
    //     },
    //     {
    //       id: 1,
    //       name: '电信二区'
    //     }
    //   ], [
    //     {
    //       id: 0,
    //       name: '长安城'
    //     },
    //     {
    //       id: 1,
    //       name: '龙争虎斗'
    //     },
    //     {
    //       id: 2,
    //       name: '扬州城'
    //     },
    //     {
    //       id: 3,
    //       name: '枫华谷'
    //     },
    //     {
    //       id: 3,
    //       name: '逍遥林'
    //     }
    //   ]
    // ],
    array: ['金发', '盒子', '衣服', '披风', '其他'],
    index: 0,
    multiIndex: [1, 0],
    server:[1,0],
    date: new Date().toLocaleDateString(),
    today: new Date().toLocaleDateString(),
    items: [
      { name: '0', value: '按外观类型查询', checked: 'true' },
      { name: '1', value: '按物品名称查询'}
    ],
    showCode:0
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var service_key = 0;
    var regionList = this.data.regionList;
    var serviceList = this.data.serviceList;
    var select_key = e.detail.value[1];
    var real_key = select_key - 1;
    if (real_key < service_key) {
      this.setData({
        service_id: 0
      })
    } else {
      this.setData({
        service_id: serviceList[real_key].service_id　　　　　　// service_id 代表着选择的服务器对应的 班级id
      })
    }
    this.setData({
      multiIndex: e.detail.value,
      server: [this.data.region_id, this.data.service_id]
    })
    console.log(this.data.server)
  },
  bindMultiPickerColumnChange: function (e) {
    //e.detail.column 改变的数组下标列, e.detail.value 改变对应列的值
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
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      showCode: e.detail.value
    })
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var self = this

    self.setData({
      loading: true
    })
    wx.request({
      url: config.service.getPriceUrl,
      data: e.detail.value,
      success:res=>{
        self.setData({
          loading: false
        })
        console.log(res.data)
        if (res.data.length!=0)
        {
          var quotes = JSON.stringify(res.data)
          console.log(quotes)
          wx.navigateTo({
            url: '../showPrice/showPrice?quotes=' + quotes,
          })
        }else{
          wx.showModal({
            title: '提示',
            content: '没有数据。可能没有报价或关键词错误。是否跳转至关键词列表？',
            cancelText:'取消',
            confirmText:'跳转',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                //跳转
                wx.navigateTo({
                  url: '../productList/productList'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
  },
  searchService(region_id) {
    var that = this;
    if (region_id>=0) {
      this.setData({
        region_id: region_id
      })
      var url = config.service.getService;
      wx.request({
        url: config.service.getService,
        data:{
          region_id:region_id
        },
        success:res=>{
          var serviceList = res.data;
          console.log(serviceList);
          var serviceArr = serviceList.map(item => {
            return item.service_nickname;
          })
          serviceArr.unshift('全部服务器');　　　　　　// 接口中没有提供全部服务器字段，添加之
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: config.service.getRegion,
      data: {},
      success:res=> {
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
        var default_region_id = regionList[1]['region_id'];　　　　//获取默认的大区对应的 region_id
        if (default_region_id>=0) {
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