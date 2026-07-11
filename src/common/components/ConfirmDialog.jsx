import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message = 'Are you sure?',
  onCancel = () => {},
  onConfirm = () => {},
  confirmLabel = 'Yes',
  cancelLabel = 'Cancel',
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    setTimeout(() => cancelRef.current?.focus(), 0);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        tabIndex={-1}
        className="w-full max-w-lg rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="text-xl font-semibold text-slate-900">
          {title}
        </h3>
        <p id="confirm-desc" className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            ref={cancelRef}
            onClick={onCancel}
            className="btn-secondary w-full sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className="btn-primary w-full sm:w-auto">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
