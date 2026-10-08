import { useEffect } from 'react';

/** Keep keyboard navigation in the active dialog, including after lazy loading. */
export function useDialogFocus(active: string | null) {
  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let dialog: HTMLElement | null = null;
    const focusables = () => dialog ? Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]'
    )).filter(el => !el.closest('[aria-hidden="true"]') && el.getClientRects().length > 0) : [];
    const focusFirst = () => {
      if (!dialog) return;
      dialog.tabIndex = -1;
      (focusables()[0] ?? dialog).focus({ preventScroll: true });
    };
    const discover = () => {
      if (dialog?.isConnected) return;
      dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
      if (dialog) focusFirst();
    };
    const observer = new MutationObserver(discover);
    observer.observe(document.body, { childList: true, subtree: true });
    discover();
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = focusables();
      const current = items.indexOf(document.activeElement as HTMLElement);
      // Cycle explicitly; hidden off-screen export nodes must never receive focus.
      event.preventDefault();
      if (!items.length) { focusFirst(); return; }
      const next = current < 0 ? (event.shiftKey ? items.length - 1 : 0) : (current + (event.shiftKey ? -1 : 1) + items.length) % items.length;
      items[next].focus();
    };
    const onFocus = (event: FocusEvent) => {
      if (dialog?.isConnected && !dialog.contains(event.target as Node)) focusFirst();
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [active]);
}
