import clsx from 'clsx';

export default function Card({ className, children, ...props }) {
  return (
    <div className={clsx('bg-white card-shadow rounded-sm', className)} {...props}>
      {children}
    </div>
  );
}
