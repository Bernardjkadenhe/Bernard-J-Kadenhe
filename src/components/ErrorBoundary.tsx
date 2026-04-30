import * as React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        const firestoreError = JSON.parse(this.state.error?.message || '');
        if (firestoreError.error.includes('permission-denied')) {
          errorMessage = "You don't have permission to access this data. Please ensure you are signed in and authorized.";
        }
      } catch (e) {
        if (this.state.error?.message) {
          errorMessage = this.state.error.message;
        }
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-red-100 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-black tracking-tighter text-gray-900 mb-4 uppercase">SYSTEM ERROR</h2>
            <p className="text-gray-600 mb-12 leading-relaxed">
              {errorMessage}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center group"
            >
              <RefreshCcw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
