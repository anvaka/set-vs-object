var util = require('util');
var rng = require('ngraph.random').random(42);

var getRandomKey = require('./lib/getRandomKey.js');

var keysCount = getKeysCount(process.argv[2], 100000);
var keyLength = 12;

var set = new Set();
console.log('Generating ' + keysCount + ' keys of length ' + keyLength + ' each...');
for (var i = 0; i < keysCount; ++i) {
  var key = getRandomKey(keyLength, rng);
  set.add(key);
}

console.log('Memory usage (bytes): ' + JSON.stringify(process.memoryUsage()));

function getKeysCount(countFromArgs, defaultValue) {
  var count = parseInt(countFromArgs, 10);
  return isNaN(count) ? defaultValue : count;
}

