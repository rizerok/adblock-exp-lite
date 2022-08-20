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

export function querySelector (selector: string, parent: Element | Document = document): Element {
  const $element = parent.querySelector(selector);
  if (!$element) {
    throw Error(`${selector} not found`)
  }
  return $element;
}
