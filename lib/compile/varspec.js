module.exports = varspec

function varspec(expr, op, body) {
  return body.split(',').map(compile)

  function compile(spec, i, specs) {
    var args = { name: '', explode: false, slice: false }
      , loc  = specs.slice(0, i).join(',').length
      , col  = -1

    while (spec.length >++ col) {
      var chr = spec[col]

      if (chr === '*') {
        if (col === spec.length - 1) {
          args.explode = true
        } else {
          throw error('Explode modifier must be the last character of an expression', expr, loc + col)
        }
      } else if (chr === ':') {
        var len = +spec.slice(col + 1)

        if (len === len) {
          args.slice = len
          col = spec.length
        } else {
          throw error('Prefix modifier must be followed by an integer', expr, loc + col)
        }
      } else {
        args.name += chr
      }
    }

    return expander(op, args)
  }
}

var isEmpty = require('funkis').isEmpty
  , error   = require('./error')
  , isnt    = require('funkis').isnt
  , is      = require('funkis').is

function expander(op, args) {
  var explode = args.explode
    , name    = args.name
    , pie     = args.slice
    , sep     = explode? op.sep : ','

  return expand

  function expand(vars) {
    var value = vars[name]

    if (isnt(value)) return null

    if (pie && isnt(String, value)) {
      throw new Error('Unable to prefix non-string expression value: ' + name)
    }

    if (is(Array, value)) {
      if (isEmpty(value)) return null

      value = value.map(op.enc)

      if (op.named) {
        if (explode) {
          return value.map(function(x) {
            return name + '=' + x
          }).join(sep)
        } else {
          return name + '=' + value.join(sep)
        }
      } else {
        return value.join(sep)
      }
    } else if (is(Object, value)) {
      if (isEmpty(value)) return null

      value = Object.keys(value).map(function(k) {
        return op.enc(k) + (explode? '=' : ',') + op.enc(value[k])
      }).join(sep)

      return explode || !op.named? value : name + '=' + value
    } else {
      pie && (value = value.slice(0, pie))
      value = op.enc(value)
      op.named && (value = name + (value? '=' : op.empty) + value)
      return value
    }
  }
}