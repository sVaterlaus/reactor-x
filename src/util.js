const { __, pipe, prop, curry, ifElse, isNil, identity, bind, apply, type, equals } = require('ramda')
const { Observable } = require('rxjs')

const method = curry((name, args, object) => pipe(
  prop(name),
  ifElse(
    isNil,
    identity,
    pipe(
      bind(__, object),
      apply(__, args)
    )
  )
)(object))

const sideEffect = curry((fn, val) => {
  fn(val)
  return val
})

const isFunction = pipe(
  type,
  equals('Function')
)

const isObject = pipe(
  type,
  equals('Object')
)

const isArray = pipe(
  type,
  equals('Array')
)

const isString = pipe(
  type,
  equals('String')
)

const observableFrom = item =>
  new Observable(subscriber => method('subscribe', [val => subscriber.next(val)], item))

module.exports = {
  method,
  sideEffect,
  isFunction,
  isObject,
  isArray,
  isString,
  observableFrom
}
