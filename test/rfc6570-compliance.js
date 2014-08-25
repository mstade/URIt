var partial = require('funkis').partial 
  , expect  = require('chai').expect
  , suite   = load()
  , URIt    = require('../lib/URIt')
  , is      = require('funkis').is

describe('RFC 6570 compliance', function() {
  suite.forEach(function(cases) {
    Object.keys(cases).forEach(function(title) {
      describe(title, function() {
        var vars  = cases[title].variables
          , tests = cases[title].testcases

        describe('when given the variables:\n' + JSON.stringify(vars, null, 2), function() {
          tests.forEach(function(test) {
            describe('and when given the template: ' + test[0], function() {

              if (is(Array, test[1])) {
                it('should expand to one of: \n' + test[1].join('\n'), function() {
                  var template = URIt(test[0])
                  expect(test[1]).to.include(template.expand(vars))
                })
              } else if (test[1] === false) {
                it('should fail to expand with an error', function() {
                  expect(function() {
                    URIt(test[0]).expand(vars)
                  }).to.throw(Error)
                })
              } else {
                it('should expand to: ' + test[1], function() {
                  var template = URIt(test[0])
                  expect(template.expand(vars)).to.equal(test[1])
                })
              }
            })
          })
        })
      })
    })
  })
})

function load() {
  var fs    = require('fs')
    , path  = require('path')
    , cases = 'rfc6570-cases'

  return fs
    .readdirSync(path.join(__dirname, cases))
    .filter(function(file) {
      return path.extname(file) === '.json'
    })
    .map(function(file) {
      return path.join(__dirname, cases, file)
    })
    .map(function(file) {
      return fs.readFileSync(file)
    })
    .map(JSON.parse)
}