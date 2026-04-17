import clsx from 'clsx';

const variants = {
  danger: 'bg-red-100 text-red-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-700',
};

export default function Badge({ variant = 'info', className, children }) {
  return (
    <span
      className={clsx(
        'text-xs font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
