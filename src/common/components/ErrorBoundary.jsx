import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[50vh] items-center justify-center p-8">
          <div className="w-full max-w-md rounded-[1.5rem] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm" role="alert">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100">
              <span className="text-2xl">!</span>
            </div>
            <p className="mt-4 text-lg font-semibold text-rose-900">Something went wrong</p>
            <p className="mt-2 text-sm text-rose-700">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
