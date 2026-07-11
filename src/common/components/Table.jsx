import { memo, useState } from 'react';

function Table({
  columns = [],
  data = [],
  total = 0,
  page = 1,
  pageSize = 20,
  onPageChange = () => {},
  onSearch = () => {},
  showSearch = true,
  filters = null,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hasFilters = Boolean(filters);
  const totalPages = Math.max(1, Math.ceil((total || data.length) / pageSize));

  const mobileColumns = columns.filter((c) => c.key !== 'actions');

  const renderCell = (column, row) =>
    column.render ? column.render(row) : (row[column.key] ?? '-');

  return (
    <div role="region" aria-label="table list" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {showSearch && (
          <div className="w-full sm:w-72">
            <label htmlFor="table-search" className="sr-only">
              Search records
            </label>
            <input
              id="table-search"
              placeholder="Search records"
              aria-label="Search records"
              onChange={(e) => onSearch(e.target.value)}
              className="input-base"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {filters}
          {hasFilters && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn-secondary sm:hidden"
            >
              Filters
            </button>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:hidden">
          <div className="w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
                <p className="mt-1 text-sm text-slate-500">Refine the current table view.</p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-semibold text-slate-700 transition hover:text-slate-900"
              >
                Close
              </button>
            </div>
            <div className="mt-5 space-y-4">
              {showSearch && (
                <div>
                  <label htmlFor="table-search-drawer" className="sr-only">
                    Search records
                  </label>
                  <input
                    id="table-search-drawer"
                    placeholder="Search records"
                    aria-label="Search records"
                    onChange={(e) => onSearch(e.target.value)}
                    className="input-base"
                  />
                </div>
              )}
              {filters && <div>{filters}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:hidden">
        {data.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
            No records found.
          </div>
        ) : (
          data.map((row, index) => (
            <article key={row.id ?? index} className="card-base p-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="grid gap-3">
                  {mobileColumns.map((column) => (
                    <div key={column.key} className="grid gap-1">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {column.label}
                      </span>
                      <span className="text-sm font-medium text-slate-900">
                        {renderCell(column, row)}
                      </span>
                    </div>
                  ))}
                </div>

                {columns.some((c) => c.key === 'actions') && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {columns.find((c) => c.key === 'actions')?.render?.(row)}
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] border-separate border-spacing-0" role="table">
          <caption className="sr-only">{total || data.length} records, page {page} of {totalPages}</caption>
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="text-left px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-700"
                  scope="col"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-sm text-slate-500"
                  colSpan={columns.length}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 transition hover:bg-slate-50">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className="px-4 py-4 text-sm text-slate-700 align-top whitespace-nowrap"
                    >
                      {renderCell(c, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <nav className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600" aria-label="Table pagination">
        <div>
          Showing {data.length} of {total || data.length} entries
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="btn-secondary px-3 py-1 text-sm"
          >
            Prev
          </button>
          <span className="px-2">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="btn-secondary px-3 py-1 text-sm"
          >
            Next
          </button>
        </div>
      </nav>
    </div>
  );
}

export default memo(Table);
