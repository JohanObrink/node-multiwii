var chai = require('chai'),
  expect = chai.expect,
  merge = require('../../lib/merge');

describe('\u2b50  merge', function () {

  var defaults;

  beforeEach(function () {
    defaults = {
      foo: 'bar',
      isFoo: true,
      something: 42
    };
  });

  it('adds missing properties to object', function () {
    expect(merge({ herp: 'derp' }, defaults)).to.eql({
      foo: 'bar',
      isFoo: true,
      something: 42,
      herp: 'derp'
    });
  });

  it('removes declared undefineds from object', function () {
    expect(merge({ herp: 'derp', foo: undefined }, defaults)).to.eql({
      isFoo: true,
      something: 42,
      herp: 'derp'
    });
  });
});