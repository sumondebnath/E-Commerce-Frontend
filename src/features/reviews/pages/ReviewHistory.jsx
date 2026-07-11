import { useQuery } from '@tanstack/react-query';
import { MessageSquare } from 'lucide-react';
import { getUserReviews } from '@/features/reviews/services/reviews.service';
import useAuth from '@/features/auth/useAuth';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';
import { PageHeaderSkeleton } from '@/common/components/UI/Skeleton';

export default function ReviewHistory() {
  const { user } = useAuth();
  const q = useQuery({ queryKey: ['my-reviews'], queryFn: () => getUserReviews(), staleTime: 1000 * 60 });
  useDocumentTitle('My Reviews');

  if (q.isLoading) return <PageHeaderSkeleton />;

  if (q.isError) {
    return (
      <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="font-medium text-rose-700">Error loading reviews.</p>
      </div>
    );
  }

  const reviews = (q.data || []).filter((r) => r.user === user?.id);

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-slate-500" />
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Your reviews</h1>
            <p className="mt-2 text-sm text-slate-500">
              {reviews.length} review{reviews.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <MessageSquare className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-900">No reviews yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Reviews you write for purchased products will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <article key={review.id} className="card-base p-6 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {review.product_name || review.product}
                </h2>
                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Reviewed
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{review.comment}</p>
              {review.rating && (
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
