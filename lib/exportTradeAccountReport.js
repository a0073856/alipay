'use strict';

var md5 = require('./md5');
var request = require('request');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var _ = require('lodash');

/**
 * 财务明细
 * @param config  配置
 * @param gmtCreateStart  开始时间  yyyy-MM-dd HH:mm:ss
 * @param gmtEndStart 结束时间  yyyy-MM-dd HH:mm:ss
 */
module.exports = function (config, gmtCreateStart, gmtCreateEnd, cb) {
  var body = {
    service: 'export_trade_account_report',
    partner: config.partner,
    _input_charset: config._input_charset,
    sign_type: config.sign_type,
    gmt_create_start: gmtCreateStart,
    gmt_create_end: gmtCreateEnd
  };

  body = md5.sign(config, body);
  request.post({url: config.url, form: body}, function (err, response, body) {
    if (err) {
      return console.log(err);
    }
    parseString(body, function (err, result) {
      var csv_result = result.alipay.response[0].csv_result[0];
      var records = csv_result.csv_data[0].split(',');
      var obj = {};
      var arr = [];
      var aa = 'aa';
      _.each(records, function (v, i) {
        var num = i % 14;
        switch (num) {
          case 0 ://外部订单号
            obj = {
              foreignOrderNo: v.substring(1)
            };
            break;
          case 1 ://账户余额（元）
            obj.balance = v;
            break;
          case 2 ://时间
            obj.createTime = v;
            break;
          case 3 ://流水号
            obj.flowNo = v;
            break;
          case 4 ://支付宝交易号
            obj.tradeNo = v;
            break;
          case 5 ://交易对方Email
            obj.supEmail = v;
            break;
          case 6 ://交易对方
            obj.sup = v;
            break;
          case 7 ://用户编号
            obj.userNo = v;
            break;
          case 8 ://收入（元
            obj.receive = v;
            break;
          case 9 ://支出（元
            obj.pay = v;
            break;
          case 10 ://交易场所
            obj.tradePlace = v;
            break;
          case 11 ://商品名称
            obj.productName;
            break;
          case 12 ://类型
            obj.productType;
            break;
          case 13 ://说明
            obj.remark;
            arr.push(obj);
            break;
        }
      });
      var data = {
        total: csv_result.count[0],
        results: _.sortByOrder(arr.slice(1), 'time', 'desc')
      };
      cb(data);
    });
  });
};