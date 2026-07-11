import Providers from '@/app/providers/Providers';
import AppRoutes from '@/app/AppRoutes';
import ErrorBoundary from '@/common/components/ErrorBoundary';

export default function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </Providers>
  );
}
