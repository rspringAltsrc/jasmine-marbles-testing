import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { concatMap, map, mapTo, mergeMap, switchMap, takeWhile } from 'rxjs/operators';

describe('Marble testing operators', () => {
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = getTestScheduler();
  })

  describe('Map', () => {
    it('should add "1" to each value emitted', () => {
      const values = { a: 1, b: 2, c: 3, x: 2, y: 3, z: 4 };
      const source = cold('-a-b-c-|', values);
      const expected = cold('-x-y-z-|', values);

      const result = source.pipe(map(x => x + 1));
      expect(result).toBeObservable(expected);
    });
  });

  describe('MapTo', () => {
    it('should map every value emitted to "surprise!"', () => {
      // const values = { a: 1, b: 2, c: 3, x: 'surprise!' };
      // const source = cold('-a-b-c-|', values);
      // const expected = cold('-x-x-x-|', values);

      // const result = source.pipe(mapTo('surprise!'));
      // expect(result).toBeObservable(expected);

      testScheduler.run(helpers => {
        const { cold, expectObservable } = helpers;
        const values = { a: 1, b: 2, c: 3, x: 'surprise!' };
        const obs1 = '-a-b-c-|';
        const expected = '-x-x-x-|';

        const sut = cold(obs1, values).pipe(
          mapTo('surprise!')
        );

        expectObservable(sut).toBe(expected, values);
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

        expectObservable(sut).toBe(expected)
      });
    });
  });
});