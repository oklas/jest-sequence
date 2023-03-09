import toMatchSequence from './toMatchSequence'

export default class Sequence {
  _expected: unknown[][] = []
  _received: unknown[][] = []

  constructor() {
    expect.extend({
      toMatchSequence,
    })
  }

  clean() {
    this._expected = []
    this._received = []
  }

  received() {
    return this._received
  }

  expected() {
    return this._expected
  }

  expectSync() {
    const max = Math.max(this._received.length, this._expected.length)
    for (let i of Array(max).keys()) {
      expect(this._received[i]).toEqual(this._expected[i])
    }
  }

  add<T extends object, M extends jest.FunctionPropertyNames<Required<T>>>(
    object: T,
    method: M,
    args: unknown[],
  ) {
    const callId = CallSequence.prototype._callId(object, method)
    this._expected.push([callId, args])
  }

  spyOn<T extends object, M extends jest.FunctionPropertyNames<Required<T>>>(
    object: T,
    methodKeys: M | M[],
  ) {
    const keys: M[] = Array.isArray(methodKeys) ? methodKeys : [methodKeys]
    for (const key of keys) this._spyOn(object, key)
  }

  _spyOn<T extends object, M extends jest.FunctionPropertyNames<Required<T>>>(
    object: T,
    methodKey: M,
  ) {
    const original = object[methodKey] as (...args: any[]) => any
    if (jest.isMockFunction(original)) {
      const callId = this._callId(object, methodKey)
      throw Error(`unable spy twice or mocked for '${callId}' do restoreAllMocks()`)
    }
    const spy = jest.spyOn(object, methodKey)
    // @ts-ignore
    object._CallSequenceForTest = this._received
    spy.mockImplementation(function (this: any, ...args) {
      const callId = CallSequence.prototype._callId(this as T, methodKey)
      this._CallSequenceForTest.push([callId, args])
      return original.apply(this, args)
    })
  }

  _callId<T extends object, M extends jest.FunctionPropertyNames<Required<T>>>(
    object: T,
    method: M,
  ) {
    return object.constructor.name + '.' + method.toString()
  }
}
