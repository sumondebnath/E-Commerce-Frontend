import { useQuery } from '@tanstack/react-query';
import api from '@/api/axios';
import { ADMIN } from '@/api/endpoints';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

function useStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get(ADMIN.STATS);
      return res.data;
    },
    staleTime: 1000 * 30,
  });
}

export default function AdminDashboard() {
  useDocumentTitle('Admin dashboard');
  const { data, isLoading } = useStats();

  if (isLoading)
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
        Loading dashboard…
      </div>
    );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Overview of orders, users, and store performance.
          </p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-base p-5">
          <p className="text-sm text-slate-500">Total orders</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data?.orders?.total ?? '—'}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{data?.users?.total ?? '—'}</p>
        </div>
        <div className="card-base p-5">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {data?.revenue?.total ? `$${data.revenue.total}` : '—'}
          </p>
        </div>
      </div>

      <section className="card-base p-6">
        <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
        <p className="mt-2 text-sm text-slate-500">
          Charts and recent activity will appear here once integrated with a chart library.
        </p>
      </section>
    </div>
  );
}
