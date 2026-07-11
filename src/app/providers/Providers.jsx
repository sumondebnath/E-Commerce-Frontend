import QueryProvider from './QueryProvider';
import AuthProvider from '@/features/auth/AuthProvider';
import ToastProvider from './ToastProvider';


export default function Providers({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
