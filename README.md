# jest-sequence

[![](https://img.shields.io/npm/v/jest-sequence.svg)](https://www.npmjs.com/package/jest-sequence)
[![codecov coverage](https://img.shields.io/codecov/c/github/oklas/jest-sequence.svg)](https://codecov.io/github/oklas/jest-sequence)
[![npm](https://img.shields.io/npm/dt/jest-sequence.svg)](http://www.npmtrends.com/jest-sequence)
![TypeScript compatible](https://img.shields.io/badge/typescript-compatible-brightgreen.svg)

## Testing sequence

A class perfoms some sync or async actions may looks for example like this:

```ts
class Test {
  other() {}
  first(num: number) { return num }
  second(str: string) { return str }

  async main() {
    await quant(1)
    this.first(1)
    this.other()
    await quant(1)
    this.second('test')
  }
}
```

To be sure that some of methods is called in appropriate order
and at appropriate time and with required arguments
the test spec may looks like this:

```ts
import { sequence, quant, timeout } from 'jest-sequence'

const methodsOfTestToWatch = [
  'main', 'first', 'second'
] as jest.FunctionPropertyNames<Test>[]

describe('test sequence', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('match known sequence', async () => {
    const test = new Test()
    const sequence = new Sequence()
    sequence.spyOn(Test.prototype, methodsOfTestToWatch)

    test.main()

    sequence.add(test, 'main', [])
    expect(sequence).toMatchSequence()
  
    await quant(1)
    sequence.add(test, 'first', [1])
    expect(sequence).toMatchSequence()

    await quant(1)
    sequence.add(test, 'second', ['test'])
    expect(sequence).toMatchSequence()
  })
})
```

The utility function `timeout` is just promisify `setTimeout()`.

The utility function `quant(x)` is simple wrapper for `timeout(x * quantTimeout)`.

The internal variable `quantTimeout` by default is 200ms and may be modified via
environment variable `JEST_SEQUENCE_QUANT`.