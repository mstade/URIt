module.exports = URItemplate

function URItemplate(pattern) {
  var parts = []
    , open  = false
    , buff  = ''
    , i     = -1

  while (pattern.length >++ i) {
    var expr, parse

    if (pattern[i] === '{') {
      if (open) throw error('Expressions must not be nested', pattern, i)

      open = true

      if (buff) {
        parts.push(fixed(buff))
        buff = ''
      }
    } else if (pattern[i] === '}') {
      if (!open) throw error('Expression is missing an opening bracket', pattern, i)
      if (!buff) throw error('Expression must not be empty', pattern, i)

      parts.push(expression(buff))
      buff = ''
      open = false
    } else {
      buff += pattern[i]
    }
  }

  if (buff) {
    if (open) throw error('Expression is missing a closing bracket', pattern, i)
    parts.push(fixed(buff))
  }

  parts.expand = {
    value: function(vars) {
      return parts.map(function(p) {
        return p.value.expand(vars)
      }).join('')
    }
  } 

  return Object.create(URItemplate, parts)
}

function part(type, expander) {
  return { value:
    { type: type
    , expand: expander
    }
  }
}

function fixed(expr) {
  return part('fixed', constantly(expr))
}

function expression(expr) {
  return part('expression', compile(expr))
}

var constantly = require('funkis').constantly
  , compile    = require('./compile/expression')
  , error      = require('./compile/error')