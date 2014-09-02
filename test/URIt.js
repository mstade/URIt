var partial = require('funkis').partial 
  , expect  = require('chai').expect
  , each    = require('funkis').each
  , URIt    = require('../lib/URIt')

describe('URIt', function() {
  var t = URIt('/foo/bar{/baz}{?wibble,bob}')
    , v = { baz: 1, wibble: false, bob: 'hello' }

  it('should only return the pattern parts as enumerable properties', function() {
    expect(Object.keys(t)).to.eql([0, 1, 2].map(String))
  })

  describe('.expand', function() {
    describe('when given a template and some values', function() {
      it('should return the concatenated result of expanding each part', function() {
        expect(t.expand(v)).to.equal(
          Object.keys(t).map(function(p) {
            return t[p].expand(v)
          }).join('')
        )
      })
    })
  })

  describe('.pattern', function() {
    it('should return the source pattern', function() {
      expect(t.pattern).to.equal('/foo/bar{/baz}{?wibble,bob}')
      expect(t.pattern).to.equal(
        Object.keys(t).map(function(p) {
          return t[p].pattern
        }).join('')
      )
    })
  })

  describe('[index]', function() {
    it('should describe that part of the template', function() {
      expect(t[0]).to.have.property('type', 'fixed')
      expect(t[0]).to.have.property('pattern', '/foo/bar')
      expect(t[0].expand(v)).to.equal('/foo/bar')
      expect(t[1]).to.have.property('type', 'expression')
      expect(t[1]).to.have.property('pattern', '{/baz}')
      expect(t[1].expand(v)).to.equal('/1')
      expect(t[2]).to.have.property('type', 'expression')
      expect(t[2]).to.have.property('pattern', '{?wibble,bob}')
      expect(t[2].expand(v)).to.equal('?wibble=false&bob=hello')
    })
  })
})