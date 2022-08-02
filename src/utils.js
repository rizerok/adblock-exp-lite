export function throttle (fn, time) {
  let canFunctionExecute = true;
  return function () {
    if (canFunctionExecute) {
      canFunctionExecute = false;
      fn();
      setTimeout(() => canFunctionExecute = true, time);
    }
  }
}

export const logCloneObject = (obj) => JSON.parse(JSON.stringify(obj));
