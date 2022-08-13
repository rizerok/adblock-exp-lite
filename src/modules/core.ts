export function removeAllFixedOverlays () {
  // browser context
  console.log('removeAllFixedOverlays');
  const $allFixedEls = document.querySelectorAll('[style*="fixed"]');
  $allFixedEls.forEach((el) => {
    el.parentElement.removeChild(el);
  });
  console.log('$allFixedEls', $allFixedEls);
}
