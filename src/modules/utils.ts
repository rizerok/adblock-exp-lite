export function throttle (fn: (...args: any) => any, time: number) {
  let canFunctionExecute = true;
  return function (...args: any) {
    if (canFunctionExecute) {
      canFunctionExecute = false;
      fn(...args);
      setTimeout(() => canFunctionExecute = true, time);
    }
  }
}
