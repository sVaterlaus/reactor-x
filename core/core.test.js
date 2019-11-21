const fc = require('fast-check')
const { _isReactive } = require('../lib/symbols')

const object = require('./object')
const number = require('./number')
const string = require('./string')
const boolean = require('./boolean')
const array = require('./array')

const generateData = (callback) => {
  fc.assert(fc.property(fc.string(), fc.integer(), fc.float(), fc.boolean(), callback))
}

describe('Object Reactor', () => {
  describe('object()', () => {
    test('should throw an error when invoked with anything other than a POJO or reactive object', () => {
      generateData((str, int, float, bool) => {
        expect(() => object()).toThrow(Error)
        expect(() => object(null)).toThrow(Error)
        expect(() => object([])).toThrow(Error)
        expect(() => object(int)).toThrow(Error)
        expect(() => object(float)).toThrow(Error)
        expect(() => object(str)).toThrow(Error)
        expect(() => object(bool)).toThrow(Error)
        expect(() => object(number(int))).toThrow(Error)
        expect(() => object(string(str))).toThrow(Error)
        expect(() => object(boolean(bool))).toThrow(Error)
        expect(() => object(array([]))).toThrow(Error)

        expect(() => object({})).not.toThrow()
        expect(() => object(object({}))).not.toThrow()
      })
    })
    test('should throw an error when invoked with a POJO that contains non-reactive properties', () => {
      generateData((str, int, float, bool) => {
        expect(() => object({ string: str })).toThrow(Error)
        expect(() => object({ integer: int })).toThrow(Error)
        expect(() => object({ float: float })).toThrow(Error)
        expect(() => object({ boolean: bool })).toThrow(Error)
        expect(() => object({ array: [] })).toThrow(Error)
        expect(() => object({ object: {} })).toThrow(Error)

        expect(() => object({ string: string(str) })).not.toThrow()
        expect(() => object({ integer: number(int) })).not.toThrow()
        expect(() => object({ float: number(float) })).not.toThrow()
        expect(() => object({ boolean: boolean(bool) })).not.toThrow()
        expect(() => object({ array: array([]) })).not.toThrow()
        expect(() => object({ object: object({}) })).not.toThrow()
      })
    })
    test('should return a reactive object when invoked with a POJO or reactive object', () => {
      expect(object({})[_isReactive]).toBe(true)
      expect(object(object({}))[_isReactive]).toBe(true)
    })
    test('should always return the same reactive object when invoked with a reactive object wrapped any number of times, ', () => {
      expect(object({})).toEqual(object(object({})))
      expect(object({})).toEqual(object(object(object({}))))
      expect(object({})).toEqual(object(object(object(object({})))))
    })
  })
  describe('.valueOf()', () => {
    test('should return a POJO without any reactive properties when invoked', () => {
      generateData((str, int, float, bool) => {
        const testData = {
          string: str,
          integer: int,
          float: float,
          boolean: bool
        }
        const objectValue = object({
          string: string(str),
          integer: number(int),
          float: number(float),
          boolean: boolean(bool),
          array: array([]),
          object: object({
            string: string(str),
            integer: number(int),
            float: number(float),
            boolean: boolean(bool),
            array: array([])
          })
        }).valueOf()

        expect(objectValue).toMatchObject({
          ...testData,
          array: [],
          object: testData
        })
      })
    })
  })
  describe('.update()', () => {
    test('should throw an error when invoked with a POJO that contains any reactive properties', () => {
      generateData((str, int, float, bool) => {
        const testObject = object({
          string: string(str),
          integer: number(int),
          float: number(float),
          boolean: boolean(bool)
        })
        const emptyObject = object({})

        expect(() => testObject.update({
          string: string(str),
          integer: number(int),
          float: number(float),
          boolean: boolean(bool)
        })).toThrow(Error)
        expect(() => testObject.update({
          string: string(str),
          integer: int,
          float: float,
          boolean: bool
        })).toThrow(Error)
        expect(() => testObject.update({
          string: string(str),
          integer: int,
          float: float,
          boolean: bool
        })).toThrow(Error)
        expect(() => emptyObject.update(object({}))).toThrow(Error)

        expect(() => testObject.update({
          string: str,
          integer: int,
          float: float,
          boolean: bool
        })).not.toThrow()
      })
    })
    test('should throw an error when invoked with anything other than a POJO with matching type structure or a function that returns a POJO with matching type structure', () => {
      generateData((str, int, float, bool) => {
        const testData = {
          string: str,
          integer: int,
          float: float,
          boolean: bool
        }
        const testObject = object({
          string: string(str),
          integer: number(int),
          float: number(float),
          boolean: boolean(bool),
          array: array([]),
          object: object({
            string: string(str),
            integer: number(int),
            float: number(float),
            boolean: boolean(bool),
            array: array([])
          })
        })

        expect(() => testObject.update(str)).toThrow(Error)
        expect(() => testObject.update(int)).toThrow(Error)
        expect(() => testObject.update(float)).toThrow(Error)
        expect(() => testObject.update(bool)).toThrow(Error)
        expect(() => testObject.update(string(str))).toThrow(Error)
        expect(() => testObject.update(number(int))).toThrow(Error)
        expect(() => testObject.update(number(float))).toThrow(Error)
        expect(() => testObject.update(boolean(bool))).toThrow(Error)
        expect(() => testObject.update({})).toThrow(Error)
        expect(() => testObject.update({ string: str })).toThrow(Error)
        expect(() => testObject.update({ ...testData, array: [] })).toThrow(Error)
        expect(() => testObject.update({ ...testData, array: [], object: { string: str } })).toThrow(Error)

        expect(() => testObject.update({
          ...testData,
          array: [],
          object: {
            ...testData,
            array: []
          }
        })).not.toThrow(Error)
      })
    })
    // test('should replace its inner value with the given, valid input, returning the new value', () => {

    // })
  })
})
