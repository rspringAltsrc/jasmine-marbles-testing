import { identity } from './identity';

describe('identity', () => {
  it('returns the same value', () => {
    // Arrange
    const x: string = 'Hello Jasmine!';

    // Act
    const y: string = identity(x);

    // Assert
    expect(y).toBe('Hello Jasmine!');
  });
});
