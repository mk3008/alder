/** Decide all text visibility from the same expanded measurements.
 * Shrinking can only remove title, then captions; it never reintroduces text.
 * Measuring and restoring the final mode is synchronous (before paint), and
 * does not depend on the previous mode or a viewport-specific font size. */
export function installHeaderTitleFit(header: HTMLElement) {
  const title = header.querySelector<HTMLElement>('strong')!;
  const actions = Array.from(header.querySelectorAll<HTMLElement>(':scope > button, :scope > a'));
  const update = () => {
    header.classList.remove('header-icons-only');
    const style = getComputedStyle(header);
    const gap = parseFloat(style.columnGap) || 0;
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    // The flexible spacer adds one gap; the preview badge has its own lane.
    const captioned = actions.reduce((width, action) => width + action.getBoundingClientRect().width, 0)
      + gap * actions.length + padding;
    const full = captioned + title.getBoundingClientRect().width + gap;
    title.classList.toggle('header-title-hidden', full > header.clientWidth);
    header.classList.toggle('header-icons-only', captioned > header.clientWidth);
  };
  update();
  window.addEventListener('resize', update);
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(update);
    [header, title, ...actions].forEach(element => observer.observe(element));
  }
  void document.fonts?.ready.then(update);
  document.fonts?.addEventListener('loadingdone', update);
}
