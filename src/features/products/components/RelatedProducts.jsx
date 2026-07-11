import { useQuery } from '@tanstack/react-query';
import { getRelatedProducts } from '../services/products.service';
import ProductCard from './ProductCard';

export default function RelatedProducts({ categoryId, excludeId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['related-products', categoryId, excludeId],
    queryFn: () => getRelatedProducts(categoryId, excludeId),
    enabled: !!categoryId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading || !data?.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Related products</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
