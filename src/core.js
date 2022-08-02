export function removeAllFixedOverlays () {
  console.log('removeAllFixedOverlays');
  const $allFixedEls = document.querySelectorAll('[style*="fixed"]');
  $allFixedEls.forEach((el) => {
    el.parentElement.removeChild(el);
  });
  console.log('$allFixedEls', $allFixedEls);
}
