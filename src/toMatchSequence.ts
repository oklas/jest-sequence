import {expect} from '@jest/globals'
import type {MatcherFunction} from 'expect'
import {equals, iterableEquality} from '@jest/expect-utils'
import {
  MatcherHintOptions,
  printDiffOrStringify,
  printExpected,
  printReceived,
  matcherHint,
  stringify,
} from 'jest-matcher-utils'
import CallSequence from './Sequence'

const toMatchSequence: MatcherFunction<[]> = (
  actual,
) => {
  if (actual instanceof CallSequence === false) {
    throw new Error('These must be of type CallSequence!')
  }

  const sequence = actual as CallSequence
  const matcherName = 'toEqual'
  const options: MatcherHintOptions = {
    comment: 'deep equality',
  }

  const expected = sequence.expected()
  const received = sequence.received()

  const pass = equals(received, expected, [iterableEquality])
  const message = pass
    ? () =>
        // eslint-disable-next-line prefer-template
        matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        `Expected: not ${printExpected(expected)}\n` +
        (stringify(expected) !== stringify(received)
          ? `Received:     ${printReceived(received)}`
          : '')
    : () =>
        // eslint-disable-next-line prefer-template
        matcherHint(matcherName, undefined, undefined, options) +
        '\n\n' +
        printDiffOrStringify(expected, received, 'Expected', 'Received', true)
  return {actual: received, expected, message, name: matcherName, pass}
}

export const extend = () => {
  // to avoid 'expect' is declared but never read
  expect.extend({
    toMatchSequence,
  })
}

declare module 'expect' {
  interface AsymmetricMatchers {
    toMatchSequence(): void
  }
  interface Matchers<R> {
    toMatchSequence(): R
  }
}

export default toMatchSequence
