module.exports = slice

function slice(varspec, col) {
  var len = ~~varspec.slice(col + 1)

  if (len === len) {
    return {
      slice: function(value) {
        value.slice(0, len)
      }
    }
  } else {
    return SyntaxError('Prefix modifier must be followed by an integer')
  }
}