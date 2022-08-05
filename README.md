# Benchmark: Faster way to count unique objects

*TL;DR Sets are 2x faster in this benchmark. Please be cautious
and don't generalize this statement to all Set operations.*

Counting unique elements is a common task in many programs.
Until recently the most straightforward way to do so was something along
these lines:

```js
function getUniqueElements(array) {
  var counter = {};
  for (var i = 0; i < array.length; ++i) {
    var key = array[i];
    counter[key] = 1;
  }
  return Object.keys(counter);
}

var unique = getUniqueElements(["cat", "dog", "cat"]);
// unique is: ['cat', 'dog']
```

_SIDE NOTE_: This program has a subtle bug. ~~Open issue if you found it and
I'll give you credit.~~ Kudos to @lukaszsamson, @erykpiast, @elclanrs, @Slayer95
and @bchelli for [bringing answers](https://github.com/anvaka/set-vs-object/issues)!

With introduction of [Set object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
things have changed. The program can be rewritten as:

```js
function getUniqueSet(array) {
  return new Set(array);
}

var uniqueSet = getUniqueSet(["cat", "dog", "cat"]);
// uniqueSet now has only two elements 'cat' and 'dog'.
```

`Set` is [supported by all major browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Browser_compatibility)
but is it really faster than plain old `Object`?

## Benchmark: Jaccard Similarity

[Jaccard similarity](https://en.wikipedia.org/wiki/Jaccard_index) is a simple
function which takes two sets and returns their "similarity" index:

```
function similarity(A, B) {
  intersection = (number of shared elements between A and B)
  union = (number of unique elements in A and B)

  return intersection/union
}
```

For example, similarity between set `cat, dog, bird` and set `cat` is `1/3`.
There is one shared element (`cat`), and there are three unique elements.

Now we have to implement this function two times: using `Set` and using `Object`:

```js
function similarityObject(objA, objB) {
  var aKeys = Object.keys(objA);
  var intersect = 0;
  aKeys.forEach(function(key) {
    if (objB[key]) intersect += 1;
  });
  var objBSize = Object.keys(setB).length;
  var objASize = aKeys.length;
  var similarity = intersect / (objASize + objBSize - intersect);

  return similarity;
}

function similaritySet(setA, setB) {
  var intersect = 0;
  setA.forEach(function(key) {
    if (setB.has(key)) intersect += 1;
  });
  var similarity = intersect / (setA.size + setB.size - intersect);

  return similarity;
}
```

To have statistically reliable answers we run these functions over
and over again on the same data set and count how many times we were able to
compute similarity index. [Benchmark](https://www.npmjs.com/package/benchmark)
module is extremely good for this. Here are the results:

```
> node index.js
Compute jaccard similarity with Set x 3,445 ops/sec ±2.39% (84 runs sampled)
Compute jaccard similarity with Map x 3,479 ops/sec ±0.40% (91 runs sampled)
Compute jaccard similarity with objects (Object.keys()) x 1,787 ops/sec ±0.97% (86 runs sampled)
Compute jaccard similarity with objects (for in) x 1,698 ops/sec ±0.75% (91 runs sampled)
Fastest is Compute jaccard similarity with Map
(Set) Jaccard top pair at: 2 (0.010101010101010102)
(Map) Jaccard top pair at: 2 (0.010101010101010102)
(Obj.keys) Jaccard top pair at: 2 (0.010101010101010102)
```

Set objects are two times faster than our old plain Object. The tests
were executed using node version `14.4.0`

## Memory consideration

I compared RAM consumption by building 1,000,000 string keys and stored them
both as object keys and as set elements. There was huge overhead of memory 
usage with objects.

Set used ~67MB, while Object used ~126MB:


```
Testing with Set
Memory usage (bytes): {
   "rss": 113,303,552,
   "heapTotal": 89,473,024,
   "heapUsed":67,126,776,
   "external":775,983
}

Testing with Object
Memory usage (bytes): {
  "rss": 155,701,248,
  "heapTotal": 131,948,544,
  "heapUsed": 126,989,976,
  "external": 775,983
}
```

You can read description of each field here: [process.memoryUsage()](https://nodejs.org/api/process.html#process_process_memoryusage).

Tes code is in [testMemory.sh](https://github.com/anvaka/set-vs-object/blob/master/testMemory.sh)

# Conclusion

Sets are awesome and we should use them more often. They are fast, and supported
by Chrome, Firefox, Microsoft Edge, and Node.js.

You can explore [index.js](https://github.com/anvaka/set-vs-object/blob/master/index.js)
file to see the actual benchmark code.

## Other benchmarks

* [Array vs Object](https://github.com/anvaka/array-vs-object) - what is faster:
store array of vectors, or encode vectors into array?
* [Iterator vs foreach](https://github.com/anvaka/iterator-vs-foreach) - what is faster:
use `forEach`, `for`, `for .. of`, `[Symbol.Iterator]()`, or `yield *`?


## Bonus

If you haven't seen it yet, watch this video about performance and benchmarking
from Vyacheslav Egorov: https://www.youtube.com/watch?v=65-RbBwZQdU .

He doesn't talk about Sets or Jaccard similarity. His view on benchmarking
changed how I perceive them now, and I hope you will love it too!
