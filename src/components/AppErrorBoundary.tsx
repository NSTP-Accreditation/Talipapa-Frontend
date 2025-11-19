/**
 * App-level Error Boundary
 * Catches unhandled errors and prevents entire app from crashing
 * Provides user-friendly error UI with reload option
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('App Error Boundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Oops! Something went wrong
                  </h1>
                  <p className="text-red-100 text-sm mt-1">
                    We're sorry for the inconvenience
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 leading-relaxed">
                An unexpected error occurred. This might be a temporary issue.
                Please try reloading the page or return to the homepage.
              </p>

              {/* Error details in development */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <summary className="cursor-pointer font-semibold text-red-800 text-sm mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-red-900 bg-red-100 p-3 rounded overflow-auto max-h-32">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </div>
                    {this.state.errorInfo && (
                      <div className="text-xs font-mono text-red-900 bg-red-100 p-3 rounded overflow-auto max-h-48">
                        <strong>Component Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-1">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                  Go Home
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  Reload Page
                </button>
              </div>

              {/* Help Text */}
              <p className="text-xs text-gray-500 text-center pt-2">
                If this problem persists, please contact support
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
