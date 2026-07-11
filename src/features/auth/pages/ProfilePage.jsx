import useAuth from '../useAuth';
import { Link } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import useDocumentTitle from '@/common/hooks/useDocumentTitle';

export default function ProfilePage() {
  const { user } = useAuth();
  useDocumentTitle('Profile');

  return (
    <section className="card-base p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Your profile</h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage your account information.
          </p>
        </div>
        <Link to="/profile/edit" className="btn-secondary">
          Edit profile
        </Link>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="h-4 w-4" />
            Name
          </div>
          <p className="mt-2 text-base font-medium text-slate-900">
            {user?.full_name || user?.email || '—'}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Mail className="h-4 w-4" />
            Email
          </div>
          <p className="mt-2 text-base font-medium text-slate-900">{user?.email || '—'}</p>
        </div>
      </div>
    </section>
  );
}
