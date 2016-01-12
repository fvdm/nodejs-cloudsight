/*
Name:         cloudsight
Description:  Node.js module to access CloudSight API methods
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.con/fvdm/nodejs-cloudsight
Feedback:     https://github.con/fvdm/nodejs-cloudsight/issues
License:      Unlicense (Public Domain, see LICENSE file)
*/

var httpreq = require ('httpreq');

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
 * @returns {void}
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
 * Get result data for image
 *
 * @param {string} token - Image token
 * @param {function} callback
 * @returns {void}
 */

function imageResponses (token, callback) {
  var options = {
    method: 'GET',
    path: '/image_responses/' + token
  };

  talk (options, callback);
}


/**
 * Check status at preferred interval
 *
 * @param {string} token - Image token
 * @param {function} callback
 * @returns {void}
 */

function pollStatus (token, callback) {
  imageResponses (token, function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    if (data.status === 'not completed') {
      setTimeout (function () {
        pollStatus (token, callback);
      }, 1000);
    } else {
      callback (null, data);
    }
  });
}


/**
 * Send an image for processing
 *
 * @param {object} props - See README.md
 * @param {boolean} [polling=false] - Callback only when results are ready
 * @param {function} callback - Callback response
 * @returns {void}
 */

function imageRequests (props, polling, callback) {
  var options = {
    method: 'POST',
    path: '/image_requests',
    data: props
  };

  talk (options, function (err, data) {
    if (err) {
      callback (err);
      return;
    }

    if (polling && data.token) {
      setTimeout (function () {
        pollStatus (data.token, callback);
      }, 4000);

      return;
    }

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
 * @returns {object} - Module methods
 */

module.exports = function (conf) {
  config.apikey = conf.apikey || null;
  config.endpoint = conf.endpoint || 'https://api.cloudsightapi.com';
  config.timeout = conf.timeout || 5000;

  return {
    request: imageRequests,
    response: imageResponses
  };
};
