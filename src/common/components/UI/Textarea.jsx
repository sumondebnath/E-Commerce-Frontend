import { forwardRef, useId } from 'react';

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', ...props },
  ref
) {
  const errorId = useId();
  const textareaId = props.id || useId();

  return (
    <div>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`input-base mt-2 min-h-[120px] ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : ''} ${className}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
});

export default Textarea;
