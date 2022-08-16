import { Log } from '../log';

describe('log', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should not output if enabled is false', () => {
    const spy = jest.spyOn(console, 'log');
    const log = new Log();
    log.enabled = false;
    log.log('test');
    expect(spy).not.toHaveBeenCalled();
  });
  test('should output sub-message if it exist', () => {
    const spy = jest.spyOn(console, 'log');
    const log = new Log('submes');
    log.enabled = true;
    log.log('test');
    expect(spy).toHaveBeenCalledWith('[submes]: ', 'test');
  });
  test('should not output sub-message if it not exist', () => {
    const spy = jest.spyOn(console, 'log');
    const log = new Log();
    log.enabled = true;
    log.log('test');
    expect(spy).toHaveBeenCalledWith('test');
    log.log('test1', 2, '3');
    expect(spy).toHaveBeenCalledWith('test1', 2, '3');
  });
  test('should log cloned object', () => {
    const spy = jest.spyOn(console, 'log');
    const log = new Log();
    log.enabled = true;
    log.logCloneObject({ a: 1, b: '2', c: { d: 3}}, { e: 4});
    expect(spy).toHaveBeenCalledWith({ a: 1, b: '2', c: { d: 3}}, { e: 4});
  });
});
