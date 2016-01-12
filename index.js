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
 * GUID generator
 *
 * @returns {string}
 */

function guidGenerator () {
  function S4 (times, prefix) {
    var str = '';
    var i;

    for (i = times || 1; i > 0; i--) {
      str += String (prefix);
      str += parseInt (((Math.random () + 1) * 0x10000), 10) .toString (16) .substring (1);
    }

    return str;
  }

  return (S4 (2) + S4 (4, '-') + S4 (2));
}


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
    files: props.files || null,
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
    data: {}
  };

  var keys = Object.keys (props);
  var i;

  // default values
  props.locale = props.locale || 'en-US';
  props.language = props.language || 'en';
  props.device_id = props.device_id || guidGenerator ();

  // image is a file
  if (props.image) {
    options.files ['image_request[image]'] = props.image;
    delete props.image;
  }

  // wrap fieldnames
  for (i = 0; i < keys.length; i++) {
    options.data ['image_request[' + keys [i] + ']'] = props [keys [i]];
  }

  // send it
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
