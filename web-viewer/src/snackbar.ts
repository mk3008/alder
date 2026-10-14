type Kind = 'success' | 'warning' | 'error';

/** One non-modal message. Errors stay until dismissed; routine results expire. */
export function createSnackbar(bar: HTMLElement, text: HTMLElement, close: HTMLButtonElement, fallback: HTMLElement, canDismiss:()=>boolean=()=>true, onChange:()=>void=()=>{}) {
  const doc = bar.ownerDocument, win = doc.defaultView!;
  let timer: number | undefined, remaining = 0, started = 0, hovered = false;
  let returnFocus: HTMLElement | null = null, activeKey = '';
  const errors = new Map<string, string>();
  const stop = () => {
    if (timer !== undefined) {
      win.clearTimeout(timer);
      remaining = Math.max(0, remaining - (Date.now() - started));
      timer = undefined;
    }
  };
  const dismiss = (userAction=false) => {
    if(userAction&&!canDismiss())return;
    stop();
    errors.delete(activeKey);
    const pending = [...errors].at(-1);
    if (pending) { show(pending[1], 'error', pending[0]); return; }
    const focused = bar.contains(doc.activeElement);
    bar.hidden = true;
    text.textContent = '';
    onChange();
    if (focused) (returnFocus?.isConnected ? returnFocus : fallback).focus({preventScroll:true});
  };
  const resume = () => {
    if (bar.hidden || bar.dataset.kind === 'error' || hovered || doc.hidden || bar.contains(doc.activeElement)) return;
    stop();
    started = Date.now();
    timer = win.setTimeout(dismiss, remaining);
  };
  bar.addEventListener('pointerenter', () => { hovered = true; stop(); });
  bar.addEventListener('pointerleave', () => { hovered = false; resume(); });
  bar.addEventListener('focusin', event => {
    const previous = event.relatedTarget as HTMLElement | null;
    if (previous && !bar.contains(previous)) returnFocus = previous;
    stop();
  });
  bar.addEventListener('focusout', () => win.setTimeout(resume, 0));
  bar.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dismiss(true); }
  });
  doc.addEventListener('visibilitychange', () => doc.hidden ? stop() : resume());
  close.onclick = () => dismiss(true);
  const show = (message: string, kind: Kind, key: string) => {
    stop();
    if (!bar.contains(doc.activeElement)) returnFocus = doc.activeElement as HTMLElement | null;
    activeKey = key;
    bar.dataset.kind = kind;
    bar.dataset.key = key;
    text.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    text.setAttribute('aria-live', kind === 'error' ? 'assertive' : 'polite');
    text.setAttribute('aria-atomic', 'true');
    bar.hidden = false;
    text.textContent = message;
    onChange();
    remaining = kind === 'warning' ? 8000 : 5000;
    resume();
  };
  return (message: string, kind: Kind = 'success', key: 'operation' | 'storage' = 'operation') => {
    if (kind === 'error' && message) { errors.delete(key); errors.set(key, message); }
    else errors.delete(key);
    const pending = [...errors].at(-1);
    if (pending) {
      if (!bar.hidden && text.textContent === pending[1] && activeKey === pending[0]) return;
      show(pending[1], 'error', pending[0]);
      return;
    }
    if (!message) { if (activeKey === key) dismiss(); return; }
    if (!bar.hidden && text.textContent === message && bar.dataset.kind === kind) return;
    show(message, kind, key);
  };
}
