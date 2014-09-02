module.exports = URItemplate

function URItemplate(pattern) {
  var parts = {}
    , open  = false
    , buff  = ''
    , len   = 0
    , i     = -1

  while (pattern.length >++ i) {
    var expr, parse

    if (pattern[i] === '{') {
      if (open) throw error('Expressions must not be nested', pattern, i)

      open = true
      buff && (parts[len++] = fixed(buff))
      buff = ''
    } else if (pattern[i] === '}') {
      if (!open) throw error('Expression is missing an opening bracket', pattern, i)
      if (!buff) throw error('Expression must not be empty', pattern, i)

      parts[len++] = expression(buff)
      buff = ''
      open = false
    } else {
      buff += pattern[i]
    }
  }

  if (buff) {
    if (open) throw error('Expression is missing a closing bracket', pattern, i)
    parts[len++] = fixed(buff)
  }

  parts.pattern = { value: pattern }

  return Object.create(URItemplate, parts)
}

URItemplate.expand = function expand(vars) {
  var templ = this

  return Object.keys(templ).map(function(p) {
    return templ[p].expand(vars)
  }).join('')
}

function part(type, pattern, expander) {
  var prop =
      { enumerable: true
      , value:
        { type    : type
        , expand  : expander
        , pattern : pattern
        }
      }

  return prop
}

function fixed(expr) {
  return part('fixed', expr, constantly(expr))
}

function expression(expr) {
  return part('expression', '{' + expr + '}', compile(expr))
}

var constantly = require('funkis').constantly
  , compile    = require('./compile/expression')
  , error      = require('./compile/error')