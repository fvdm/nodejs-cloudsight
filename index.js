/*
Name:         cloudsight
Description:  Node.js module to access CloudSight API methods
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.con/fvdm/nodejs-cloudsight
Feedback:     https://github.con/fvdm/nodejs-cloudsight/issues
License:      Unlicense (Public Domain, see LICENSE file)
*/

var httpreq = require ('httpreq');
var app = {};

var config = {
  apikey: null,
  endpoint: null,
  timeout: null
};


/**
 * Communication
 *
 * @param {object} props
 * @param {string} [props.method=GET] - GET or POST
 * @param {string) props.path - i.e. /image_requests/token
 * @param {object} [props.data] - Data fields to send
 * @param {string} [props.endpoint=config.endpoint] - API endpoint override
 * @param {number} [props.timeout=config.timeout] - Request timeout override
 * @param {function} callback - Process response
 * @returns {object} app - Module methods
 */

function talk (props, callback) {
  var options = {
    url: config.endpoint + props.path,
    method: props.method || 'GET',
    parameters: props.data || null,
    timeout: props.timeout || config.timeout,
    headers: {
      'Accept': 'application/json',
      'Authorization': 'CloudSight ' + config.apikey,
      'User-Agent': 'cloudsight.js (https://github.com/fvdm/nodejs-cloudsight)'
    }
  };

  httpreq.doRequest (options, function (err, res) {
    var data = res && res.body || '';
    var code = res && res.statusCode || null;
    var error = null;

    // request error
    if (err) {
      error = err;
      error.statusCode = code;
      callback (error);
      return;
    }

    // http error
    if (code && code >= 300) {
      error = new Error ('HTTP error');
      error.statusCode = code;
      error.body = data;
      callback (error);
      return;
    }

    // parse body
    try {
      data = JSON.parse (data);
    } catch (e) {
      error = e;
      error.statusCode = code;
      error.body = data;
      callback (error);
      return;
    }

    // API error
    if (data.error) {
      error = new Error ('API error');
      error.statusCode = code;
      error.error = data.error;
      callback (error);
      return;
    }

    // all good
    callback (null, data);
  });
}


/**
 * Module config and defaults
 *
 * @param {object} conf
 * @param {string} conf.apikey - Account API key
 * @param {string} [conf.endpoint] - Override API endpoint
 * @param {number} [conf.timeout=5000] - Override request timeout
 * @returns {object} app - Module methods
 */

module.exports = function (conf) {
  config.apikey = conf.apikey || null;
  config.endpoint = conf.endpoint || 'https://api.cloudsightapi.com';
  config.timeout = conf.timeout || 5000;

  return app;
};
