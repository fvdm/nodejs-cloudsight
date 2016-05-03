/*
Name:           cloudsight - test.js
Source & docs:  https://github.com/fvdm/nodejs-cloudsight
Feedback:       https://github.com/fvdm/nodejs-cloudsight/issues
License:        Unlicense (public domain)
*/

var dotest = require ('dotest');
var path = require ('path');
var dir = path.dirname (module.filename);
var app = require (path.join (dir));

var cloudsight;
var cache = {
  token: null
};


// Setup
// set env CLOUDSIGHT_KEY  (CI tests)
var config = {
  apikey: process.env.CLOUDSIGHT_KEY || null,
  endpoint: process.env.CLOUDSIGHT_ENDPOINT || null,
  timeout: process.env.CLOUDSIGHT_TIMEOUT || 5000
};

if (!config.apikey) {
  config.endpoint = 'https://frankl.in/u/ci_test.php?a=cloudsight&b=';
}

cloudsight = app (config);


// module basics
dotest.add ('Module', function () {
  dotest.test ()
    .isFunction ('fail', 'exports', app)
    .isObject ('fail', 'interface', cloudsight)
    .isFunction ('fail', '.request', cloudsight && cloudsight.request)
    .isFunction ('fail', '.response', cloudsight && cloudsight.response)
    .done ();
});

// upload image without status polling
dotest.add ('.request - upload without polling', function () {
  var image = {
    image: path.join (dir, 'test_image.png'),
    locale: 'nl-NL'
  };

  cloudsight.request (image, false, function (err, data) {
    cache.token = data && data.token;
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isString ('warn', 'data.url', data && data.url)
      .done ();
  });
});

// upload image with status polling
dotest.add ('.request - upload with polling', function () {
  var image = {
    image: path.join (dir, 'test_image.png'),
    locale: 'nl-NL'
  };

  cloudsight.request (image, true, function (err, data) {
    cache.token = data && data.token;
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.status', data && data.status, 'completed')
      .done ();
  });
});

// send image from url without status polling
dotest.add ('.request - url without polling', function () {
  var image = {
    remote_image_url: 'https://frankl.in/u/test_image.png',
    locale: 'nl-NL'
  };

  cloudsight.request (image, false, function (err, data) {
    cache.token = data && data.token;
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isString ('warn', 'data.url', data && data.url)
      .done ();
  });
});

// send image from url with status polling
dotest.add ('.request - url with polling', function () {
  var image = {
    remote_image_url: 'https://frankl.in/u/test_image.png',
    locale: 'nl-NL'
  };

  cloudsight.request (image, true, function (err, data) {
    cache.token = data && data.token;
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('warn', 'data.status', data && data.status, 'completed')
      .done ();
  });
});

// get image status
dotest.add ('.response', function () {
  cloudsight.response (cache.token, function (err, data) {
    cache.token = data && data.token;
    dotest.test (err)
      .isObject ('fail', 'data', data)
      .isExactly ('fail', 'data.token', data && data.token, cache.token)
      .done ();
  });
});


// Start the tests
dotest.run ();
