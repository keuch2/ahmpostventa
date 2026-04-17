import clsx from 'clsx';

const variants = {
  primary: 'btn-honda',
  secondary: 'btn-honda-outline',
  ghost: 'bg-transparent text-gray-600 hover:text-honda-red font-medium transition-all',
  danger: 'bg-red-600 text-white font-bold uppercase tracking-wider hover:bg-red-700 transition-colors',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button className={clsx(variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
