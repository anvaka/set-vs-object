var Benchmark = require('benchmark');
var randomAPI = require('ngraph.random');
var suite = new Benchmark.Suite;
var topPairJaccardIndex, topPairJaccardValue,
    topPairObjectIndex, topPairObjectValue,
    topPairObject1Index, topPairObject1Value;
var charSet = 'abcdefghijklmnopqrstuvwxyz';

suite.add('Compute jaccard similarity with Set', function() {
  var seed = 42;
  var rnd = randomAPI.random(seed);
  var max = 0;
  for (var i = 0; i < 10; ++i) {
    var setA = generateSet(100, rnd);
    var setB = generateSet(100, rnd);
    var intersect = 0;
    setA.forEach(function(key) {
      if (setB.has(key)) intersect += 1;
    });
    var similarity = intersect/(setA.size + setB.size - intersect);

    if (similarity > max) {
      topPairJaccardIndex = i;
      topPairJaccardValue = max = similarity;
    }
  }
}).add('Compute jaccard similarity with objects (Object.keys())', function() {
  // Both methods should yield the same results, since we are using the
  // same seed for the random number generator:
  var seed = 42;
  var rnd = randomAPI.random(seed);
  var max = 0;
  for (var i = 0; i < 10; ++i) {
    var setA = generateSetObjects(100, rnd);
    var setB = generateSetObjects(100, rnd);
    var intersect = 0;
    var setAKeys = Object.keys(setA);
    setAKeys.forEach(function(key) {
      if (setB[key]) intersect += 1;
    });
    var setBSize = Object.keys(setB).length
    var setASize = setAKeys.length;
    var similarity = intersect/(setASize + setBSize - intersect);

    if (similarity > max) {
      topPairObjectIndex = i;
      topPairObjectValue = max = similarity;
    }
  }
}).add('Compute jaccard similarity with objects (for in)', function() {
  // Both methods should yield the same results, since we are using the
  // same seed for the random number generator:
  var seed = 42;
  var rnd = randomAPI.random(seed);
  var max = 0;
  for (var i = 0; i < 10; ++i) {
    var setA = generateSetObjects(100, rnd);
    var setB = generateSetObjects(100, rnd);
    var intersect = 0;
    var setASize = 0;
    for (var key in setA) {
      if (setB[key]) intersect += 1;
      setASize += 1;
    }

    var setBSize = 0;
    for (var keyB in setB) {
      setBSize += 1;
    }
    var similarity = intersect/(setASize + setBSize - intersect);

    if (similarity > max) {
      topPairObject1Index = i;
      topPairObject1Value = max = similarity;
    }
  }
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  console.log('(Set) Jaccard top pair at: ' + topPairJaccardIndex + ' (' + topPairJaccardValue + ')');
  console.log('(Obj.keys) Jaccard top pair at: ' + topPairObjectIndex + ' (' + topPairObjectValue + ')');
  console.log('(Obj.for in) Jaccard top pair at: ' + topPairObject1Index + ' (' + topPairObject1Value + ')');
})
.run({ 'async': true });

function generateSet(count, rnd) {
  var set = new Set();
  for (var i = 0; i < count; ++i) {
    var key = getRandomKey(3, rnd)
    set.add(key);
  }
  return set;
}

function generateSetObjects(count, rnd) {
  var set = Object.create(null);
  for (var i = 0; i < count; ++i) {
    var key = getRandomKey(3, rnd)
    set[key] = 1;
  }
  return set;
}

function getRandomKey(length, rnd) {
  var result = '';
  for (var i = 0; i < length; ++i) {
    result += charSet[rnd.next(charSet.length)]
  }
  return result;
}
