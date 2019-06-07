import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { concatMap, map, mapTo, mergeMap, switchMap, takeWhile } from 'rxjs/operators';

describe('Marble testing operators', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = getTestScheduler();
  })

  describe('Map', () => {
    it('should add "1" to each value emitted', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 1, b: 2, c: 3, x: 2, y: 3, z: 4 };
        const obs1 = '-a-b-c-|';
        const expected = '-x-y-z-|';

        const sut = cold(obs1, values).pipe(
          map((x: number) => x + 1)
        );

        expectObservable(sut).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('MapTo', () => {
    it('should map every value emitted to "surprise!"', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 1, b: 2, c: 3, x: 'surprise!' };
        const obs1 = '-a-b-c-|';
        const expected = '-x-x-x-|';

        const sut = cold(obs1, values).pipe(
          mapTo('surprise!')
        );

        expectObservable(sut).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('MergeMap', () => {
    it('should maps to inner observable and flattens', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 'hello', b: 'world', x: 'hello world' };
        const obs1 = '-a-------a--|';
        const obs2 = '-b-b-b-|';
        const expected = '--x-x-x---x-x-x-|';

        const sut = cold(obs1, values).pipe(
          switchMap(x => cold(obs2, values).pipe(
            map(y => x + ' ' + y)
          ))
        );

        expectObservable(sut).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('SwitchMap', () => {
    it('should maps each value to inner observable and flattens', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 10, b: 30, x: 20, y: 40 };
        const obs1 = '-a-----a--b-|';
        const obs2 = 'a-a-a|';
        const expected = '-x-x-x-x-xy-y-y|';

        const sut = cold(obs1, values).pipe(
          switchMap((x: number) => cold(obs2, values).pipe(
            map((y: number) => x + y)
          ))
        );

        expectObservable(sut).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('ConcatMap', () => {
    it('should maps values to inner observable and emits in order', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 10, b: 30, x: 20, y: 40 };
        const obs1 = '-a--------b------ab|';
        const obs2 = 'a-a-a|';
        const expected = '-x-x-x----y-y-y--x-x-xy-y-y|';

        const sut = cold(obs1, values).pipe(
          concatMap((x: number) => cold(obs2, values).pipe(
            map((y: number) => x + y)
          ))
        );

        expectObservable(sut).toBe(expected, values);
        expect().nothing();
      });
    });
  });

  describe('TakeWhile', () => {
    it('should emit until value is > 5', () => {
      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;

        const source = '  -1--3---6---4---7--2------|';
        const expected = '-1--3---|';

        const sut = cold(source).pipe(
          takeWhile(x => x < 5)
        );

        expectObservable(sut).toBe(expected);
        expect().nothing();
      });
    });
  });
});