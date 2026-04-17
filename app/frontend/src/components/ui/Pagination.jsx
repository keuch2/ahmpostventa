import clsx from 'clsx';

export default function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    if (
      i === 1 ||
      i === lastPage ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-honda-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <i className="fa-solid fa-chevron-left mr-1"></i> Ant
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`dots-${idx}`} className="px-2 py-2 text-xs text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={clsx(
              'min-w-[32px] px-2 py-2 text-xs font-bold rounded-sm transition-colors',
              page === currentPage
                ? 'bg-honda-red text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600 hover:text-honda-red disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Sig <i className="fa-solid fa-chevron-right ml-1"></i>
      </button>
    </div>
  );
}
