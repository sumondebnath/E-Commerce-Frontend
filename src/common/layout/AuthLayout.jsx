export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
