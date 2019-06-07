import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw'

/**
 * 
 * RxJS marble testing allows for a more natural style of tedting observables. 
 * To get started, you will need to include a few helpers libraries, if you use 
 * jasmine, you can directly download jasmine-marbles. These libraries provide 
 * helpers for parsing marble diagrams and asserting against the subscription 
 * points and result of your observables under test.
 * - `-` (dash): indicates a passing of time, you can thing of each dash as 10ms when it comes to your tests;
 * - `a`, `b`, `c`... (characters): each character insde the dash indicates an emission;
 * - `|` (pipes): indicate the completion point of an observable;
 * - `()` (parenthesis): indicate the multiple emission in the same time frame;
 * - `^` (caret): indicates the starting point of a subscription;
 * - `!` (exclamation point): indicates the end point of a subscription;
 * - `#` (pound sign): indicates error;
 * 
 */

describe('Marble testing basics', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = getTestScheduler();
  })

  it('should understand marble diagram', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

      const source = '  --';
      const expected = '--';

      expectObservable(cold(source)).toBe(expected);
      expect().nothing();
    });
  });

  describe('cold observable', () => {
    it('should support basic string values', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const source = '-a-|';
        const expected = '-a-|';

        expectObservable(cold(source)).toBe(expected);
        expect().nothing();
      });
    });

    it('should support basic values provided as params (number)', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const values = { a: 1 };
        const source = '-a-|';
        const expected = '-a-|';

        expectObservable(cold(source, values)).toBe(expected, values);
        expect().nothing();
      });
    });

    it('should support basic values provided as params (object)', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const values = { a: { key: 'value' } };
        const source = '-a-|';
        const expected = '-a-|';

        expectObservable(cold(source, values)).toBe(expected, values);
        expect().nothing();
      });
    });

    it("should support basic errors", () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const source = '--#';
        const expected = '--#';

        expectObservable(cold(source)).toBe(expected);
        expect().nothing();
      });
    });

    it("should support custom errors", () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const source = '--#';
        const expected = '--#';

        expectObservable(cold(source, null, new Error('Oops!'))).toBe(expected, null, new Error('Oops!'));
        expect().nothing();
      });
    });

    it("should support custom Observable error", () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const expected = '#';

        expectObservable(_throw(new Error('Oops!'))).toBe(expected, null, new Error('Oops!'));
        expect().nothing();
      });
    });

    it("should support multiple emission in the same time frame", () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const values = { a: 1, b: 2, c: 3 };
        const expected = '(abc|)';

        expectObservable(of(1, 2, 3)).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('hot observable', () => {
    it('should support basic hot observable', () => {
      testScheduler.run(helpers => {
        const { hot, expectObservable } = helpers;

        const values = { a: 5 };
        const source = ' -^a-|';
        const expected = '-a-|';

        expectObservable(hot(source, values)).toBe(expected, values);
        expect().nothing();
      });
    });

    it('should support testing subscriptions', () => {
      testScheduler.run(helpers => {
        const { hot, expectObservable, expectSubscriptions } = helpers;

        const values = { a: 5 };
        const source = '-a-^b---c-|';
        const subscription = '^------!';
        const expected = '-b---c-|';

        const sut = hot(source, values);
        expectObservable(sut).toBe(expected, values);
        expectSubscriptions(sut.subscriptions).toBe(subscription);
        expect().nothing();
      });
    });
  });
});