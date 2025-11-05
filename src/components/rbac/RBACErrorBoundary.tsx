/**
 * RBAC Error Boundary Component
 *
 * Provides graceful degradation when RBAC system fails.
 * Prevents the entire app from crashing due to permission check errors.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary for RBAC Components
 * Catches errors in permission checks and displays user-friendly message
 *
 * @example
 * ```tsx
 * <RBACErrorBoundary>
 *   <Can permission={Permission.EDIT_USERS}>
 *     <EditButton />
 *   </Can>
 * </RBACErrorBoundary>
 * ```
 */
export class RBACErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('[RBAC Error Boundary] Caught error:', error);
    console.error('[RBAC Error Boundary] Error info:', errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      // trackError('RBAC_ERROR', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[200px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Access Control Error
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Unable to verify permissions. This may be a temporary issue.
                </p>

                {/* Show error details in development */}
                {!import.meta.env.PROD && this.state.error && (
                  <details className="mb-4 text-xs text-red-800">
                    <summary className="cursor-pointer font-semibold mb-2">
                      Error Details (Dev Only)
                    </summary>
                    <pre className="bg-red-100 p-2 rounded overflow-auto max-h-32">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="flex-1 px-4 py-2 bg-white text-red-600 text-sm font-semibold rounded-lg border-2 border-red-600 hover:bg-red-50 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with RBAC error boundary
 *
 * @example
 * ```tsx
 * const SafeComponent = withRBACErrorBoundary(MyComponent);
 * ```
 */
export function withRBACErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithRBACErrorBoundary(props: P) {
    return (
      <RBACErrorBoundary fallback={fallback}>
        <Component {...props} />
      </RBACErrorBoundary>
    );
  };
}

export default RBACErrorBoundary;
