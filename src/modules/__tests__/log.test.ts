import { Log } from '../log';

describe('log', () => {
  let logSpy: any;
  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should not output if enabled is false', () => {
    const log = new Log();
    log.enabled = false;
    log.log('test');
    expect(logSpy).not.toHaveBeenCalled();
  });
  test('should output sub-message if it exist', () => {
    const log = new Log('submes');
    log.enabled = true;
    log.log('test');
    expect(logSpy).toHaveBeenCalledWith('[submes]: ', 'test');
  });
  test('should not output sub-message if it not exist', () => {
    const log = new Log();
    log.enabled = true;
    log.log('test');
    expect(logSpy).toHaveBeenCalledWith('test');
    log.log('test1', 2, '3');
    expect(logSpy).toHaveBeenCalledWith('test1', 2, '3');
  });
  test('should log cloned object', () => {
    const log = new Log();
    log.enabled = true;
    log.logCloneObject({ a: 1, b: '2', c: { d: 3}}, { e: 4});
    expect(logSpy).toHaveBeenCalledWith({ a: 1, b: '2', c: { d: 3}}, { e: 4});
  });
});
