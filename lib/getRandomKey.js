module.exports = getRandomKey;

var charSet = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Generats a random string of length `length` using seeded PRNG
 * `rnd`
 *
 * @param {number} length length of the final string.
 * @param {nugraph.random} rnd instance of seeded rnadom number generator
 *
 * @returns {string}
 */
function getRandomKey(length, rnd) {
  var result = '';
  for (var i = 0; i < length; ++i) {
    result += charSet[rnd.next(charSet.length)]
  }
  return result;
}
