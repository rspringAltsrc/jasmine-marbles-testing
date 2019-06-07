import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { interval } from 'rxjs/observable/interval';
import { of } from 'rxjs/observable/of';
import { delay, filter, map, take } from 'rxjs/operators';

describe('Marbe testing with time', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = getTestScheduler();
  })

  describe('Interval', () => {
    it('should keeps only even numbers', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const expected = '10ms a 19ms b 19ms c 19ms d 19ms e 9ms |';
        const expectedValues = { a: 0, b: 2, c: 4, d: 6, e: 8 };

        const sut = interval(10).pipe(
          take(10),
          filter(x => x % 2 === 0),
        );

        expectObservable(sut).toBe(expected, expectedValues);
        expect().nothing();
      });
    });
  });

  describe('Delay', () => {
    it('should waits 20 frames before receive the value', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const expected = '20ms (a|)';

        const sut = of('a').pipe(
          delay(20),
        );

        expectObservable(sut).toBe(expected);
        expect().nothing();
      });
    });
  });
});