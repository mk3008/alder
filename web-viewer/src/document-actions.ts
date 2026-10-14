/** Responsive disclosure over the original document buttons, never proxies. */
export function installDocumentActions(strip: HTMLElement) {
  const tabs = strip.querySelector<HTMLElement>('#tabs')!;
  const group = strip.querySelector<HTMLElement>('#document-actions')!;
  const toggle = strip.querySelector<HTMLButtonElement>('#document-actions-toggle')!;
  const actions = Array.from(group.querySelectorAll<HTMLButtonElement>('button'));
  for (const action of actions) {
    const label = document.createElement('span');
    label.className = 'document-action-label';
    label.textContent = action.getAttribute('aria-label');
    action.append(label);
  }
  let open = false;
  const close = (restore = false) => {
    open = false;
    strip.dataset.actionsOpen = 'false';
    toggle.setAttribute('aria-expanded', 'false');
    if (restore && !toggle.hidden) toggle.focus({preventScroll:true});
  };
  const availableActions = () => actions.filter(action => !action.hidden && !action.disabled);
  const update = () => {
    const previous = strip.dataset.actionsMode;
    const focused = document.activeElement;
    // Always measure the same inline layout, independent of the prior mode.
    // No DOM nodes move, so handlers, disabled state and user activation survive.
    strip.dataset.actionsMode = 'inline';
    const active = tabs.querySelector<HTMLElement>('.tab.active') || tabs.firstElementChild;
    const activeWidth = active?.getBoundingClientRect().width || 0;
    const required = group.getBoundingClientRect().width + activeWidth;
    const menu = actions.some(action => !action.hidden) && strip.clientWidth > 0 && required > strip.getBoundingClientRect().width;
    strip.dataset.actionsMode = menu ? 'menu' : 'inline';
    toggle.hidden = !menu;
    if (!menu || previous !== strip.dataset.actionsMode) {
      close();
      if (menu && group.contains(focused)) toggle.focus({preventScroll:true});
      else if (!menu && focused === toggle) availableActions()[0]?.focus({preventScroll:true});
    }
  };
  const show = (last = false) => {
    if (toggle.hidden) return;
    open = true;
    strip.dataset.actionsOpen = 'true';
    toggle.setAttribute('aria-expanded','true');
    const enabled = availableActions();
    (last ? enabled.at(-1) : enabled[0])?.focus({preventScroll:true});
  };
  toggle.onclick = () => open ? close(true) : show();
  toggle.onkeydown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); show(event.key === 'ArrowUp');
    }
  };
  group.addEventListener('keydown', event => {
    if (!open) return;
    const enabled = availableActions(), index = enabled.indexOf(document.activeElement as HTMLButtonElement);
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = (index + 1) % enabled.length;
    if (event.key === 'ArrowUp') next = (index + enabled.length - 1) % enabled.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = enabled.length - 1;
    if (next !== undefined) {event.preventDefault(); enabled[next]?.focus();}
  });
  // Capture before unrelated Escape handlers; closing this disclosure must not
  // also close the editor or a drawer. Native Tab/Shift+Tab remain untrapped.
  document.addEventListener('keydown', event => {
    if (open && event.key === 'Escape') {event.preventDefault(); event.stopImmediatePropagation(); close(true);}
  }, true);
  document.addEventListener('pointerdown', event => {
    if (open && !group.contains(event.target as Node) && !toggle.contains(event.target as Node)) close();
  });
  document.addEventListener('focusin', event => {
    if (open && !group.contains(event.target as Node) && event.target !== toggle) close();
  });
  group.addEventListener('click', event => {
    const button = (event.target as Element).closest('button');
    if (open && button && !button.disabled) close(true);
  }, true);
  close(); update();
  window.addEventListener('resize', update);
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(update).observe(strip);
  new MutationObserver(update).observe(group, {subtree:true,attributes:true,attributeFilter:['hidden']});
  void document.fonts?.ready.then(update);
  document.fonts?.addEventListener('loadingdone', update);
  return {update, close};
}
