'use strict';

var crypto = require('crypto');
var _ = require('lodash');
var fs = require('fs');

exports.sign = function sign(config, source) {
  var arr = [];
  _.forIn(source, function (v, k) {
    if (k !== 'sign' && k !== 'sign_type') {
      arr.push([k, v]);
    }
  });

  arr.sort(function (a, b) {
    return a[0] > b[0];
  });

  arr = _.map(arr, function (v) {
    return v[0] + '=' + v[1];
  });
  var signStr = arr.join('&') + config.key;
  source.sign = crypto
    .createHash('md5')
    .update(signStr, 'utf8')
    .digest('hex');
  return source;
};