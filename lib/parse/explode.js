module.exports = explode

function explode(varspec, col) {
  if (col === varspec.length - 1) {
    return {
      explode: function(value, op) {
        return value.join(op.sep)
      }
    }
  } else {
    return SyntaxError('Explode modifier must be the last character of an expression')
  }
}