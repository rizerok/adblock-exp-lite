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

export function querySelector <E extends Element = Element>(selector: string, parent: Element | Document = document): E {
  const $element = parent.querySelector<E>(selector);
  if (!$element) {
    throw Error(`${selector} not found`)
  }
  return $element;
}

export function getAttribute (selector: string, parent: Element): string {
  const $element = parent.getAttribute(selector);
  if (!$element) {
    throw Error(`${selector} not found`)
  }
  return $element;
}
