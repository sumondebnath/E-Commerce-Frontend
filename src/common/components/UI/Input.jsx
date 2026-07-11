import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    error,
    className = '',
    ...props
  },
  ref
) {
  const hasLeft = Boolean(Icon);
  const hasRight = Boolean(RightIcon);
  const errorId = useId();
  const inputId = props.id || useId();

  const inputClasses = [
    'input-base',
    hasLeft ? 'pl-11' : '',
    hasRight ? 'pr-11' : '',
    error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="relative mt-2">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={0}
            aria-label={props['aria-label'] || 'Toggle visibility'}
          >
            <RightIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      {error && <p id={errorId} className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
});

export default Input;
