cloudsight
==========

Unofficial Node.js module for the CloudSight image recognition API.

[![Changelog](https://img.shields.io/npm/v/cloudsight.svg?maxAge=3600)](https://github.com/fvdm/nodejs-cloudsight/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-cloudsight.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-cloudsight)
[![Dependency Status](https://gemnasium.com/badges/github.com/fvdm/nodejs-cloudsight.svg)](https://gemnasium.com/github.com/fvdm/nodejs-cloudsight#runtime-dependencies)

* [Node.js](https://nodejs.org/)
* [CloudSight](https://cloudsightapi.com/)
* [API documentation](http://cloudsightapi.com/docs)
* [Development](https://github.com/fvdm/nodejs-cloudsight/blob/develop/CONTRIBUTING.md)


Usage
-----

```js
var cloudsight = require ('cloudsight') ({
  apikey: 'abc123'
});

var image = {
  image: '/path/to/image.jpg',
  locale: 'en-US'
};

// Upload image to analyze, report results
cloudsight.request (image, true, console.log);
```


Installation
------------

You need a CloudSight account API key with enough credits.

`npm install cloudsight`


Methods
-------

The callback function receives result data and errors.

```js
function myCallback (err, data) {
  if (err) {
    console.log (err);
    return;
  }

  console.log (data);
}
```


#### Errors

error message  | description             | additional
:--------------|:------------------------|:--------------------------
request failed | A request error occured | `err.error`
API error      | API error occured       | `err.statusCode` and `err.error`


### .request
**( params, [polling], callback )**

Send an image to the API for analysis.


argument | type     | required | default | description
:--------|:---------|:---------|:--------|:-----------------------
params   | object   | yes      |         | Image object, see below
polling  | boolean  | no       | false   | Only callback when analysis is complete
callback | function | yes      |         | Callback function


#### Image object

param            | required | default | description
:----------------|:---------|:--------|:-------------------------------
image            | yes      |         | Local path to image, either this or `remote_image_url`
remote_image_url | yes      |         | URL to image, either this or `image`
locale           | no       | en-US   | OCR locale for text recognition
language         | no       | en      | Response data language
device_id        | no       | _UUID_  | Unique identifier for request, auto generated
latitude         | no       |         | Image context geo position
longitude        | no       |         | Image context geo position
altitude         | no       |         | Image context geo position
ttl              | no       |         | Analysis deadline in seconds or `max`
focus_x          | no       |         | Focal point in px
focus_y          | no       |         | Focal point in px


#### Example

```js
// Describe image
var image = {
  image: '/path/to/image.jpg',
  locale: 'en-US'
};
  
// Upload image
cloudsight.request (image, console.log);

// Upload image and wait for completion
cloudsight.request (image, true, console.log);
```


### .response
**( token, callback )**

Get analysis state or data for an image.


argument | type     | required | description
:--------|:---------|:---------|:---------------------------
token    | string   | yes      | Image token from `.request`
callback | function | yes      | Callback function


```js
cloudsight.response ('xyz789', console.log);
```


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>


Author
------

[Franklin van de Meent](https://frankl.in/)
