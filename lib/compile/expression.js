module.exports = expression

function expression(src) {
  var op    = operator[src[0]] || operator['NUL']
    , body  = src[0] in operator? src.slice(1) : src

  var illegal = body.match(/[~\-$|=!\s+\/;?&#]/)

  if (illegal) throw error('Unrecognized token in expression', src, illegal.index)
  
  var specs = varspec(src, op, body)

  return expand

  function expand(vars) {
    var expanded = specs.map(withArgs(vars)).filter(nil)
    return expanded.length? op.pre + expanded.join(op.sep) : ''
  }
}

var error    = require('./error')
  , varspec  = require('./varspec')
  , operator =
    { 'NUL' : { pre: ''  , sep: ',' , exp: ',' , named: false , empty: ''  , enc: U  }
    , '+'   : { pre: ''  , sep: ',' , exp: ',' , named: false , empty: ''  , enc: UR }
    , '.'   : { pre: '.' , sep: '.' , exp: ',' , named: false , empty: ''  , enc: U  }
    , '/'   : { pre: '/' , sep: '/' , exp: ',' , named: false , empty: ''  , enc: U  }
    , ';'   : { pre: ';' , sep: ';' , exp: ',' , named: true  , empty: ''  , enc: U  }
    , '?'   : { pre: '?' , sep: '&' , exp: ',' , named: true  , empty: '=' , enc: U  }
    , '&'   : { pre: '&' , sep: '&' , exp: ',' , named: true  , empty: '=' , enc: U  }
    , '#'   : { pre: '#' , sep: ',' , exp: ',' , named: false , empty: ''  , enc: UR }
    }

function U(str)  {
  return encodeURIComponent(str).replace('!', '%21')
}

function UR(str) {
  return encodeURI(str)
}

function nil(x) {
  return x != null
}

function withArgs(vars) {
  return function(expand) {
    return expand(vars)
  }
}