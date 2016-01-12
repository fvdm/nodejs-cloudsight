cloudsight
==========

Unofficial Node.js module for the CloudSight image recognition API.

[![Build Status](https://travis-ci.org/fvdm/nodejs-cloudsight.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-cloudsight)

* [Node.js](https://nodejs.org/)
* [CloudSight](https://cloudsightapi.com/)
* [API documentation](http://cloudsightapi.com/docs)
* [Development](https://github.com/fvdm/nodejs-cloudsight/wiki)


Usage
-----

```js
var cloudsight = require ('cloudsight') ({
  apikey: 'abc123'
});
```



Installation
------------

You need a CloudSight account API key with enough credits.

`npm install cloudsight`


Callback
--------

The callback function receives result data and errors. Unless an error occurs the
data JSON will be parsed to an object. When everything is ok `err` is `null` else
`err` is an instance of `Error`. It also returns API errors this same way.

```js
function myCallback (err, data) {
  if (err) {
    console.log (err);
  } else {
    console.log (data);
  }
}
```


#### Errors

error message  | description             | additional
:--------------|:------------------------|:--------------------------
request failed | A request error occured | `err.error`
API error      | API error occured       | `err.statusCode` and `err.error`


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

Franklin van de Meent
| [Website](https://frankl.in/)
| [Github](https://github.com/fvdm)
