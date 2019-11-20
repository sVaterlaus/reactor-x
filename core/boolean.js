const { _value, _reactor, _type } = require('../lib/symbols')
const { reactivePrototype } = require('./reactive')
const { withPrototype } = require('../lib/util')

const boolean = input => {
  if (typeof input !== 'boolean') {
    throw new Error('boolean() input must be a boolean')
  }
  return withPrototype({
    [_type]: 'boolean',
    [_value]: input,
    [_reactor]: boolean
  }, reactivePrototype)
}

module.exports = boolean
