import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">{label}</label>}
    <input
      ref={ref}
      className={clsx(
        'w-full border border-gray-300 px-4 py-2.5 text-sm text-gray-900 rounded-sm transition-all',
        error && 'border-red-500',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
