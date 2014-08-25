module.exports = error

function error(msg, src, col) {
  return new SyntaxError(
    [ src
    , Array(14 + col).join(' ') + '^'
    , ''
    , msg
    ].join('\n')
  )
}