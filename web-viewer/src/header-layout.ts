/** Keep the title only when it fits beside the existing action row.
 * A hidden title remains measurable, so resizing can restore it without
 * temporarily adding a row or depending on a particular font/viewport. */
export function installHeaderTitleFit(header: HTMLElement) {
  const title = header.querySelector<HTMLElement>('strong')!;
  const actions = Array.from(header.querySelectorAll<HTMLElement>(':scope > button, :scope > a'));
  const update = () => {
    const style = getComputedStyle(header);
    const gap = parseFloat(style.columnGap) || 0;
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    // Actions, title and the flexible spacer share a row; the preview badge
    // deliberately keeps its separate identification lane.
    const required = actions.reduce((width, action) => width + action.getBoundingClientRect().width, 0)
      + title.getBoundingClientRect().width + gap * (actions.length + 1) + padding;
    title.classList.toggle('header-title-hidden', required > header.clientWidth);
  };
  update();
  window.addEventListener('resize', update);
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(update);
    [header, title, ...actions].forEach(element => observer.observe(element));
  }
  void document.fonts?.ready.then(update);
}
