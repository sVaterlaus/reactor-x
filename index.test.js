const reactor = require('./index')

describe('reactor()', () => {
  test('should throw an error when given an argument that\'s not directly serializable to JSON', () => {
    expect(() => reactor(undefined)).toThrow(Error)
    expect(() => reactor(new Set())).toThrow(Error)
    expect(() => reactor(Array)).toThrow(Error)
    expect(() => reactor(Infinity)).toThrow(Error)

    expect(() => reactor({})).not.toThrow()
    expect(() => reactor([])).not.toThrow()
    expect(() => reactor(9)).not.toThrow()
    expect(() => reactor('foo')).not.toThrow()
    expect(() => reactor(false)).not.toThrow()
    expect(() => reactor(null)).not.toThrow()
  })
  test('should throw an error when given an object or array that has properties, or nested properties, that don\'t directly serialize to JSON', () => {
    expect(() => reactor({ name: 'Spencer', problem: new Error() })).toThrow()
    expect(() => reactor({ name: 'Spencer', nestedProblem: [Infinity] })).toThrow()
    expect(() => reactor(['Spencer', [[[{ veryNested: undefined }]]]])).toThrow()

    expect(() => reactor({ name: 'Spencer', noProblem: 'TADA' })).not.toThrow()
    expect(() => reactor({ name: 'Spencer', noNestedProblem: [999] })).not.toThrow()
    expect(() => reactor(['Spencer', [[[{ veryNested: null }]]]])).not.toThrow()
  })
  describe('reactor().valueOf()', () => {
    test('should return a value equal to the same argument given to reactor()', () => {
      const number = 123
      const string = 'foo bar'
      const boolean = false
      const person = { name: 'Spencer', age: 25, hobbies: ['programming', 'eating', 'exercise?'] }

      expect(reactor(number).valueOf()).toEqual(number)
      expect(reactor(string).valueOf()).toEqual(string)
      expect(reactor(boolean).valueOf()).toEqual(boolean)
      expect(reactor(person).valueOf()).toEqual(person)
    })
  })
})