import ProductCard from './ProductCard';
import { memo } from 'react';

function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default memo(ProductGrid);
