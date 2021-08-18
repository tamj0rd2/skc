/* eslint-disable func-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inspect } from 'util'

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeCalledWithArgs(...args: OverloadedArguments<T>): R
      toBeCalledWithError(error: Error): R
      toStrictlyEqual(expected: T): R
      toContainItem(expected: T extends Array<infer X> ? X : never): R
    }
  }
}

interface R {
  pass: boolean
  message(): string
}

interface CustomMatcherCtx {
  jestCtx: jest.MatcherContext
  matcherName: string
}

function toBeCalledWith<E extends unknown[]>(
  this: jest.MatcherContext,
  matcherName: string,
  received: unknown,
  jsonCompare: boolean,
  ...expectedArgs: E
): R {
  const isMock = (x: unknown): x is jest.Mock => !!(x as jest.Mock).mock
  if (!isMock(received)) {
    return {
      pass: false,
      message: getInvalidTypeMessage.bind(this, matcherName, 'a mock or spy function', received),
    }
  }

  const { calls } = received.mock

  return {
    pass:
      calls.some((callArgs) => this.equals(expectedArgs, callArgs, undefined, true)) ||
      calls.some((callArgs) =>
        this.utils.diff(expectedArgs, callArgs)?.includes('Compared values have no visual difference'),
      ) ||
      (jsonCompare && calls.some((callArgs) => JSON.stringify(expectedArgs) === JSON.stringify(callArgs))),
    message: () => {
      if (calls.length === 0) {
        return 'The mock was not called'
      }

      const formattedCalls = calls.map((callArgs: unknown[], i) => {
        const formattedCallArgs = callArgs.map((arg: any) => this.utils.RECEIVED_COLOR(this.utils.stringify(arg)))
        return `\t${i + 1}: ${formattedCallArgs.join(', ')}`
      })

      return [
        `Expected: ${expectedArgs
          .map((arg) => this.utils.EXPECTED_COLOR(this.utils.stringify(arg as any)))
          .join(', ')}`,
        `Received:`,
        ...formattedCalls,
        '',
        `Number of calls: ${this.utils.RECEIVED_COLOR(calls.length)}`,
      ].join('\n')
    },
  }
}

function toBeCalledWithArgs(this: jest.MatcherContext, received: unknown, ...args: unknown[]): R {
  return toBeCalledWith.call(this, 'toBeCalledWithArgs', received, true, ...args)
}

function toBeCalledWithError(this: jest.MatcherContext, received: unknown, expected: Error): R {
  return toBeCalledWith.call(this, 'toBeCalledWithError', received, false, expected)
}

interface ToStrictEqualCtx extends CustomMatcherCtx {
  strictCheck: boolean
}

function toStrictEqual(this: ToStrictEqualCtx, received: unknown, expected: unknown): R {
  const customEqualityTesters: jest.EqualityTester[] = []
  const isEqual = this.jestCtx.equals(expected, received, customEqualityTesters, this.strictCheck)
  const diff = this.jestCtx.utils.printDiffOrStringify(
    expected,
    received,
    'Expected:',
    'Received:',
    this.jestCtx.expand,
  )

  return {
    pass: isEqual || diff.includes('serializes to the same string'),
    message: () => diff,
  }
}

function toStrictlyEqual(this: jest.MatcherContext, received: unknown, expected: unknown): R {
  return toStrictEqual.call({ jestCtx: this, matcherName: 'toStrictlyEqual', strictCheck: true }, received, expected)
}

function toContainItem(this: jest.MatcherContext, received: unknown, expected: unknown): R {
  const matcherName = 'toContainItem'
  if (!Array.isArray(received)) {
    return {
      pass: false,
      message: getInvalidTypeMessage.bind(this, matcherName, 'an array', received),
    }
  }

  const matchingItemIndex = received.findIndex((item) => this.equals(expected, item, undefined, true))
  if (matchingItemIndex === -1) {
    return {
      pass: false,
      message: () =>
        [
          `${this.utils.matcherHint(matcherName, 'received', '...expected')}\n`,
          this.utils.EXPECTED_COLOR('Expected item:'),
          inspect(expected, false, undefined, true),
          '',
          this.utils.RECEIVED_COLOR('Received items:'),
          inspect(received, false, undefined, true),
        ].join('\n'),
    }
  }

  return { pass: true, message: () => 'Nice stuff!' }
}

function getInvalidTypeMessage(this: jest.MatcherContext, matcherName: string, expected: string, received: unknown) {
  return [
    `${this.utils.matcherHint(matcherName, 'received', '...expected')}\n`,
    `${this.utils.BOLD_WEIGHT('Matcher error:')} ${this.utils.RECEIVED_COLOR('received')} value must be ${expected}\n`,
    `Received has type:\t${typeof received}`,
    `Received has value:\t${this.utils.RECEIVED_COLOR(inspect(received))}`,
  ].join('\n')
}

const createDoNotUseMatcher = (called: string, expected: string) => (): R => ({
  message: () => `Do not use '${called}' because it is not typesafe. Use '${expected}' instead`,
  pass: false,
})

expect.extend({
  toBeCalledWith: createDoNotUseMatcher('toBeCalledWith', 'toBeCalledWithArgs'),
  toBeCalledWithArgs,
  toBeCalledWithError,
  // toMatchObject: createDoNotUseMatcher('toMatchObject', 'toStrictlyEqual'),
  toStrictEqual: createDoNotUseMatcher('toStrictEqual', 'toStrictlyEqual'),
  // toEqual: createDoNotUseMatcher('toEqual', 'toStrictlyEqual'),
  toStrictlyEqual,
  toContainItem,
})

type OverloadedArguments<T> = T extends {
  (...args: infer A1): any
  (...args: infer A2): any
  (...args: infer A3): any
  (...args: infer A4): any
}
  ? A1 | A2 | A3 | A4
  : T extends { (...args: infer A1): any; (...args: infer A2): any; (...args: infer A3): any }
  ? A1 | A2 | A3
  : T extends { (...args: infer A1): any; (...args: infer A2): any }
  ? A1 | A2
  : T extends (...args: infer A) => any
  ? A
  : any

export {}
