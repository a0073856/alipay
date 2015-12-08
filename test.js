var alipay = require('./index.js');
var config = {
  key: '',//md5码
  url: 'https://mapi.alipay.com/gateway.do?_input_charset=utf-8',
  partner: '',//合作伙伴id
  _input_charset: "utf-8",//编码
  sign_type: "MD5"//签名类型
};
alipay.exportTradeAccountReport(config, '2015-12-04 00:00:00', '2015-12-05 00:00:00', function (data) {
  console.dir(data, {depth: null});
});