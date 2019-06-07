import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { concatMap, map, mapTo, mergeMap, switchMap, takeWhile } from 'rxjs/operators';

fdescribe('TakeWhile', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = getTestScheduler();
  })
  it('should emit until value is > 5', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

      const source = '  -1--3---6---4---7--2------|';
      const expected = '-1--3---|';

      const sut = cold(source).pipe(
        takeWhile(x => +x < 5)
      );

      expectObservable(sut).toBe(expected);
      expect().nothing();
    });
  });

  xit('should emit until value is > 5', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable } = helpers;

      const source = '  -1--3---6---4---7--2------|';
      const expected = '-1--3---6|';

      const sut = cold(source).pipe(
        takeWhile(x => +x < 5)
      );

      expectObservable(sut).toBe(expected);
      expect().nothing();
    });
  });
});