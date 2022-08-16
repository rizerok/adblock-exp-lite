import { throttle } from '../utils';

describe('utils', () => {
  test('must return a function', () => {
    const mockFn = () => {};
    expect(typeof throttle(mockFn, 100)).toBe('function');
  });
  test('received function must call only one time by period', async () => {
    const mockFn = jest.fn();
    const resultFn = throttle(mockFn, 100);
    resultFn();
    resultFn();
    resultFn();
    expect(mockFn).toHaveBeenCalledTimes(1);
    await new Promise((r) => setTimeout(r, 200));
    resultFn();
    resultFn();
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
  test('received function must call with same args', async () => {
    const mockFn = jest.fn();
    const resultFn = throttle(mockFn, 100);
    resultFn(1,2,3);
    expect(mockFn).toHaveBeenCalledWith(1,2,3);
    await new Promise((r) => setTimeout(r, 200));
    resultFn(4);
    resultFn(5);
    expect(mockFn).toHaveBeenCalledWith(4);
  });
});

