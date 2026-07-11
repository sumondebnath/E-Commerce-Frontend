import { useState, useId } from 'react';

const SORT_MAP = {
  '': '',
  price_asc: 'price',
  price_desc: '-price',
  rating_desc: '-average_rating',
};

export default function ProductFilters({ categories = [], onChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const searchId = useId();
  const categoryId = useId();
  const sortId = useId();

  const apply = () => onChange({ search, category, ordering: SORT_MAP[sort] || sort });

  return (
    <form
      className="card-base space-y-5 p-5"
      onSubmit={(e) => { e.preventDefault(); apply(); }}
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Filter products</h2>
        <p className="mt-1 text-sm text-slate-500">Search by name, category, or sort order.</p>
      </div>

      <div className="space-y-4">
        <label htmlFor={searchId} className="block text-sm font-medium text-slate-700">Search</label>
        <input
          id={searchId}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="input-base"
        />
      </div>

      <div className="space-y-4">
        <label htmlFor={categoryId} className="block text-sm font-medium text-slate-700">Category</label>
        <select
          id={categoryId}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-base"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <label htmlFor={sortId} className="block text-sm font-medium text-slate-700">Sort by</label>
        <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value)} className="input-base">
          <option value="">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating_desc">Top rated</option>
        </select>
      </div>

      <div>
        <button type="submit" className="btn-primary w-full">
          Apply filters
        </button>
      </div>
    </form>
  );
}
