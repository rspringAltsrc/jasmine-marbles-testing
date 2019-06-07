import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { interval } from 'rxjs/observable/interval';
import { of } from 'rxjs/observable/of';
import { delay, filter, map, take } from 'rxjs/operators';

describe('Marbe testing with time', () => {
  describe('Interval', () => {
    it('should keeps only even numbers', () => {
      const source = interval(10, getTestScheduler()).pipe(
        take(10),
        filter(x => x % 2 === 0),
      );
      const expected = cold('-a-b-c-d-e|', { a: 0, b: 2, c: 4, d: 6, e: 8 });

      expect(source).toBeObservable(expected);
    });
  });

  describe('Delay', () => {
    it('should waits 20 frames before receive the value', () => {
      const scheduler = getTestScheduler();
      const source = of('a').pipe(
        delay(20, scheduler),
      );
      const expected = cold('--(a|)');

      expect(source).toBeObservable(expected);
    });
  });
});