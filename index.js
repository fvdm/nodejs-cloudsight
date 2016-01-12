var httpreq = require ('httpreq');
var app = {}

var config = {
  apikey: null,
  endpoint: null,
  timeout: null
};

module.exports = function (conf) {
  config.apikey = conf.apikey || null;
  config.endpoint = conf.endpoint || null;
  config.timeout = conf.timeout || 5000;

  return app;
};
