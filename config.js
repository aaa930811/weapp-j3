/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://f28cwwb0.qcloud.la';
var host2 = 'https://shenao.iok.la';
var localhost = 'http://192.168.0.104/J3Price';
var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 用code换取openId
    openIdUrl: `https://${host}/openid`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    // 发送模板消息接口
    templateMessageUrl: `https://${host}/templateMessage`,

    //报价数据查询地址
    getPriceUrl: `${localhost}/api/Quotes/GetQuotes`,
    //getPriceUrl:`https://xn--husx06d.cn/api/values/GetPrice`

    //报价数据提交地址
    quotedPrice: `${localhost}/api/Quotes/PostQuotes`,

    //获取大区
    getRegion: `${localhost}/api/Region/GetRegion`,

    //获取服务器
    getService: `${localhost}/api/Service/GetService`
  }
};

module.exports = config;
