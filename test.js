/*
Name:           cloudsight - test.js
Source & docs:  https://github.com/fvdm/nodejs-cloudsight
Feedback:       https://github.com/fvdm/nodejs-cloudsight/issues
License:        Unlicense (public domain)
*/

var app = require ('./');
var cloudsight;
var errors = 0;
var queue = [];
var next = 0;


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


// handle exits
process.on ('exit', function () {
  if (errors === 0) {
    console.log ('\n\u001b[1mDONE, no errors.\u001b[0m\n');
    process.exit (0);
  } else {
    console.log ('\n\u001b[1mFAIL, ' + errors + ' error' + (errors > 1 ? 's' : '') + ' occurred!\u001b[0m\n');
    process.exit (1);
  }
});

// prevent errors from killing the process
process.on ('uncaughtException', function (err) {
  console.log ();
  console.error (err.stack);
  console.log ();
  errors++;
});

// Queue to prevent flooding
function doNext () {
  next++;
  if (queue[next]) {
    queue[next] ();
  }
}

// doTest (passErr, 'methods', [
//   ['feeds', typeof feeds === 'object']
// ])
function doTest (err, label, tests) {
  var testErrors = [];

  if (err instanceof Error) {
    console.error (label + ': \u001b[1m\u001b[31mERROR\u001b[0m\n');
    console.dir (err, { depth: null, colors: true });
    console.log ();
    console.error (err.stack);
    console.log ();
    errors++;
  } else {
    tests.forEach (function (test) {
      if (test[1] !== true) {
        testErrors.push (test[0]);
        errors++;
      }
    });

    if (testErrors.length === 0) {
      console.log (label + ': \u001b[1m\u001b[32mok\u001b[0m');
    } else {
      console.error (label + ': \u001b[1m\u001b[31mfailed\u001b[0m  (' + testErrors.join (', ') + ')');
    }
  }

  doNext ();
}


// TESTS
queue.push (function () {
  doTest (null, 'module', [
    ['exports', typeof app === 'function'],
    ['interface', cloudsight instanceof Object]
  ]);
});


// Start the tests
queue[0] ();
