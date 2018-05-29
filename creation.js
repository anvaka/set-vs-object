var Benchmark = require('benchmark');
var randomAPI = require('ngraph.random');

var suite = new Benchmark.Suite;
var seed = 43;

var setSize = 1000;

var hugeCollisionRate = 0.5; // mathmatically incorrect, but simple.
var highCollisionRate = 1;
var fareCollisionRate = 3;
var rareCollisionRate = 10;

var actualUniqSetHuge = null,
    actualUniqSetHigh = null,
    actualUniqSetFare = null,
    actualUniqSetRare = null;

suite
  .add(`Huge collision Obj (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    generateSetObjects(setSize, (setSize * hugeCollisionRate | 0), rnd);
  })
  .add(`Huge collision Set (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    actualUniqSetHuge = generateSet(setSize, (setSize * hugeCollisionRate | 0), rnd);
  })
  .add(`High collision Obj (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    generateSetObjects(setSize, (setSize * highCollisionRate | 0), rnd);
  })
  .add(`High collision Set (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    actualUniqSetHigh = generateSet(setSize, (setSize * highCollisionRate | 0), rnd);
  })
  .add(`Fare collision Obj (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    generateSetObjects(setSize, (setSize * fareCollisionRate | 0), rnd);
  })
  .add(`Fare collision Set (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    actualUniqSetFare = generateSet(setSize, (setSize * fareCollisionRate | 0), rnd);
  })
  .add(`Rare collision Obj (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    generateSetObjects(setSize, (setSize * rareCollisionRate | 0), rnd);
  })
  .add(`Rare collision Set (size: ${setSize})`, function() {
    var rnd = randomAPI.random(seed);
    actualUniqSetRare = generateSet(setSize, (setSize * rareCollisionRate | 0), rnd);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log(`Huge collision: ${(setSize - actualUniqSetHuge.size) / setSize * 100}% duplication`);
    console.log(`High collision: ${(setSize - actualUniqSetHigh.size) / setSize * 100}% duplication`);
    console.log(`Fare collision: ${(setSize - actualUniqSetFare.size) / setSize * 100}% duplication`);
    console.log(`Rare collision: ${(setSize - actualUniqSetRare.size) / setSize * 100}% duplication`);
  })
  .run({ 'async': true });

function generateSet(count, keyRange, rnd) {
  var set = new Set();
  for (var i = 0; i < count; ++i) {
    const key = rnd.next(keyRange);
    set.add(key);
  }
  return set;
}

function generateSetObjects(count, keyRange, rnd) {
  var set = {};
  for (var i = 0; i < count; ++i) {
    const key = rnd.next(keyRange);
    set[key] = 1;
  }
  return set;
}
