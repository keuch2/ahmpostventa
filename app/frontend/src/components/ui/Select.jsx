import { forwardRef } from 'react';
import clsx from 'clsx';

const Select = forwardRef(({ label, error, className, children, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">{label}</label>}
    <select
      ref={ref}
      className={clsx(
        'w-full border border-gray-300 px-4 py-2.5 text-sm text-gray-900 rounded-sm transition-all bg-white',
        error && 'border-red-500',
        className
      )}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
));
Select.displayName = 'Select';
export default Select;
