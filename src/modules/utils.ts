export function throttle (fn: () => any, time: number) {
  let canFunctionExecute = true;
  return function () {
    if (canFunctionExecute) {
      canFunctionExecute = false;
      fn();
      setTimeout(() => canFunctionExecute = true, time);
    }
  }
}
