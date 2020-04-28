var Benchmark = require('benchmark');
var randomAPI = require('ngraph.random');

let count = 10000;
let set = new Set();
let object = Object.create(null);
let array = [];
let setFound, objectFound, arrayFound;

for (let i = 0; i < count; ++i) {
  set.add(i);
  object[i] = true;
  array[i] = true;
}

var suite = new Benchmark.Suite;
suite.add('set presence check', function() {
  var seed = 42;
  var rnd = randomAPI.random(seed);
  let found = 0;
  for (var i = 0; i < 1000; ++i) {
    let idx = rnd.next(count);
    if (set.has(idx)) found += 1;
  }
  setFound = found;
})
.add('object presence check', function() {
  var seed = 42;
  var rnd = randomAPI.random(seed);
  let found = 0;
  for (var i = 0; i < 1000; ++i) {
    let idx = rnd.next(count);
    if (object[idx]) found += 1;
  }
  objectFound = found;
}).add('Array presence check', function() {
  var seed = 42;
  var rnd = randomAPI.random(seed);
  let found = 0;
  for (var i = 0; i < 1000; ++i) {
    let idx = rnd.next(count);
    if (array[idx]) found += 1;
  }
  arrayFound = found;
}).on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  console.log('set found ' + setFound);
  console.log('array found ' + arrayFound);
  console.log('object found ' + objectFound);
})
.run({ 'async': true });
