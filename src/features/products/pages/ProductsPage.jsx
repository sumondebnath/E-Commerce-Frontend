import { useState } from 'react';
import useProducts from '../hooks/useProducts';
import useCategories from '../hooks/useCategories';
import ProductGrid from '../components/ProductGrid';
import ProductFilters from '../components/ProductFilters';
import { ProductGridSkeleton } from '@/common/components/UI/Skeleton';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function ProductsPage() {
  const [filters, setFilters] = useState({ page: 1, page_size: 24 });
  const { data, isLoading, isError, refetch } = useProducts(filters);
  const cats = useCategories();

  useDocumentTitle('Products');

  const products = data?.results || [];
  const count = data?.count || 0;
  const totalPages = Math.max(1, Math.ceil(count / filters.page_size));

  const onFilterChange = (f) => {
    setFilters((s) => ({ ...s, ...f, page: 1 }));
  };

  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">All products</h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse our latest collection with filters for instant discovery.
          </p>
        </div>
        <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {count} product{count !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <ProductFilters categories={cats.data ?? []} onChange={onFilterChange} />
        </aside>

        <div className="space-y-6">
          {isLoading ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <div className="rounded-[1.25rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
              <p className="font-medium text-rose-700">Unable to load products.</p>
              <p className="mt-1 text-sm text-rose-500">Check your connection and try again.</p>
              <button onClick={() => refetch()} className="btn-primary mt-4">
                Try again
              </button>
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
                  <p className="text-lg font-semibold text-slate-900">No products found</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try adjusting your search or filter criteria.
                  </p>
                  <button
                    onClick={() => setFilters({ page: 1, page_size: 24 })}
                    className="btn-primary mt-4"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <>
                  <ProductGrid products={products} />

                  <div className="flex flex-col items-center justify-between gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row">
                    <p className="text-sm text-slate-600">
                      Page {filters.page} of {totalPages}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={filters.page <= 1}
                        onClick={() => setFilters((s) => ({ ...s, page: s.page - 1 }))}
                        className="btn-secondary"
                      >
                        Previous
                      </button>
                      <button
                        disabled={filters.page >= totalPages}
                        onClick={() => setFilters((s) => ({ ...s, page: s.page + 1 }))}
                        className="btn-primary"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
