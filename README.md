# Benchmark: Faster way to count unique objects

Counting unique elements is a common task in many programs. 
Until recently the most straightforward way to do so was something along
these lines:

``` js
function getUniqueElements(array) {
  var counter = {};
  for (var i = 0; i < array.length; ++i) {
    var key = array[i];
    counter[key] = 1;
  }
  return Object.keys(counter);
}

var unique = getUniqueElements(['cat', 'dog', 'cat']);
// unique is: ['cat', 'dog']
```

*SIDE NOTE*: This program has a subtle bug. ~~Open issue if you found it and
I'll give you credit.~~ Kudos to @lukaszsamson, @erykpiast, @elclanrs, @Slayer95
and @bchelli for [bringing answers](https://github.com/anvaka/set-vs-object/issues)!

With introduction of [Set object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
things have changed. The program can be rewritten as:

``` js
function getUniqueSet(array) {
  return new Set(array);
}

var uniqueSet = getUniqueSet(['cat', 'dog', 'cat']);
// uniqueSet now has only two elements 'cat' and 'dog'.
```

`Set` is [supported by all major browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Browser_compatibility)
but is it really faster than plain old `Object`?

TL;DR **Set is almost two times faster than Object**.

**In the context of `getUniqueElement`, it depends on the input data. Set is faster than Object when duplication ratio is less than 0.3. Otherwise, plain object is faster.**

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

``` js
function similarityObject(objA, objB) {
    var aKeys = Object.keys(objA);
    var intersect = 0;
    aKeys.forEach(function(key) {
      if (objB[key]) intersect += 1;
    });
    var objBSize = Object.keys(setB).length
    var objASize = aKeys.length;
    var similarity = intersect/(objASize + objBSize - intersect);

    return similarity;
}

function similaritySet(setA, setB) {
    var intersect = 0;
    setA.forEach(function(key) {
      if (setB.has(key)) intersect += 1;
    });
    var similarity = intersect/(setA.size + setB.size - intersect);

    return similarity;
}
```

To have statistically reliable answers we run these functions over
and over again on the same data set and count how many times we were able to
compute similarity index. [Benchmark](https://www.npmjs.com/package/benchmark)
module is extremely good for this. Here are the results:

```
> node index.js
Compute jaccard similarity with Set x 1,232 ops/sec ±1.45% (87 runs sampled)
Compute jaccard similarity with Map x 1,193 ops/sec ±1.33% (88 runs sampled)
Compute jaccard similarity with objects (Object.keys()) x 616 ops/sec ±1.32% (85 runs sampled)
Compute jaccard similarity with objects (for in) x 600 ops/sec ±1.46% (82 runs sampled)
```

Set objects are almost two times faster than our old plain Object. The tests
were executed using v8 engine `4.6.85.31`.

## Benchmark: Emulating Set Creation

```
> node creation.js
Huge collision Obj (size: 1000) x 20,350 ops/sec ±1.00% (91 runs sampled)
Huge collision Set (size: 1000) x 12,017 ops/sec ±1.00% (90 runs sampled)
High collision Obj (size: 1000) x 19,266 ops/sec ±1.19% (91 runs sampled)
High collision Set (size: 1000) x 11,005 ops/sec ±0.94% (92 runs sampled)
Fare collision Obj (size: 1000) x 7,669 ops/sec ±0.97% (90 runs sampled)
Fare collision Set (size: 1000) x 10,974 ops/sec ±0.96% (93 runs sampled)
Rare collision Obj (size: 1000) x 2,689 ops/sec ±1.00% (93 runs sampled)
Rare collision Set (size: 1000) x 10,444 ops/sec ±1.42% (93 runs sampled)
Huge collision: 57.8% duplication
High collision: 36.8% duplication
Fare collision: 15% duplication
Rare collision: 4.8% duplication
```

Set objects are faster than old plain Object when a small fraction of duplicated elements are expected. When getting unique elements from an array with a high percentage of duplicates, old plain object is still faster. The tests were executed using node.js v8.4.0.

## Memory consideration

I compared RAM consumption by building 10,000,000 string keys and stored them
both as object keys and as set elements. There was no significant difference
between two approaches: Set used ~913MB, while Object was ~942MB. You can
find code in [testMemory.sh](https://github.com/anvaka/set-vs-object/blob/master/testMemory.sh)

# Conclusion

Sets are awesome and we should use them more often. They are fast, and supported
by Chrome, Firefox, Microsoft Edge, and node.js.

You can explore [index.js](https://github.com/anvaka/set-vs-object/blob/master/index.js)
file to see the actual benchmark code.

## Bonus

If you haven't seen it yet, watch this video about performance and benchmarking
from Vyacheslav Egorov: https://www.youtube.com/watch?v=65-RbBwZQdU .

He doesn't talk about Sets or Jaccard similarity. His view on benchmarking
changed how I perceive them now, and I hope you will love it too!
