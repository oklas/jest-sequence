import {expect} from '@jest/globals'
import Sequence from './Sequence'
import quant from './quant'

class Test {
  other() {}

  first(num: number) {
    return num
  }

  second(str: string) {
    return str
  }

  async main() {
    await quant(1)
    this.first(1)
    this.other()
    await quant(1)
    this.second('test')
  }
}

const methodsOfTestToWatch = ['main', 'first', 'second'] as jest.FunctionPropertyNames<Test>[]

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
