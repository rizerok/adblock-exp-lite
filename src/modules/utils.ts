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

export const randomInt = (integerLength: number): number => {
  if (integerLength < 1) {
    throw Error('arg must be 1 or more');
  }
  if (integerLength > 20) {
    throw Error('arg must be 20 or less');
  }
  const max = Math.floor(integerLength);
  return Math.floor((Math.random() + 1) * Math.pow(10, max - 1));
}
