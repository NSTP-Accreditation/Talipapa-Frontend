import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const ToastMessage: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => removeToast(toast.id), 4000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  // small helper for icon
  const Icon = ({ type }: { type: ToastType }) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
          </svg>
        );
    }
  };

  return (
    // container positioned at top-right
    <div className="fixed top-6 ml-150 z-[9999] flex flex-col gap-3 items-center">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-80 max-w-full transform transition-all duration-300 shadow-xl rounded-xl overflow-hidden ring-1 ring-black/5
            ${toast.type === 'success' ? 'bg-white' : 'bg-white'}
          `}
          role="status"
        >
          <div className="flex items-start p-3">
            <div
              className={`flex-shrink-0 rounded-full p-2 mr-3
                ${toast.type === 'success' ? 'bg-green-100 text-green-700' : ''}
                ${toast.type === 'error' ? 'bg-red-100 text-red-700' : ''}
                ${toast.type === 'warning' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${toast.type === 'info' ? 'bg-blue-100 text-blue-700' : ''}
              `}
            >
              <Icon type={toast.type} />
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold mb-0" style={{ color: '#1a4d2e' }}>
                  {toast.title}
                </p>
              )}
              <p className="text-sm mt-1 break-words text-gray-700">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            // small colored accent line to match variant
            className={`h-1 ${toast.type === 'success' ? 'bg-green-500' : ''} ${toast.type === 'error' ? 'bg-red-500' : ''} ${toast.type === 'warning' ? 'bg-yellow-500' : ''} ${toast.type === 'info' ? 'bg-blue-500' : ''}`}
          />
        </div>
      ))}
    </div>
  );
};

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, setLoading } = useAuth();

  // Toast state
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextIdRef = React.useRef<number>(1);

  // Helpers for toasts
  const addToast = (payload: { type?: ToastType; title?: string; message: string }) => {
    const id = nextIdRef.current++;
    const toast: Toast = {
      id,
      type: payload.type ?? 'info',
      title: payload.title,
      message: payload.message,
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // show toast for validation error(s). Keep it non-intrusive: show a single message.
      if (errors.username) {
        addToast({ type: 'error', message: errors.username });
      } else if (errors.password) {
        addToast({ type: 'error', message: errors.password });
      } else {
        addToast({ type: 'error', message: 'Please check the form and try again.' });
      }
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        // success toast (short-lived) then redirect
        addToast({ type: 'success', message: 'Signed in successfully.' });

        const from =
          (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;
        navigate(from, { replace: true });
      } else {
        setErrors({
          submit: 'Invalid username or password',
        });
        addToast({ type: 'error', message: 'Invalid username or password' });
      }
    } catch (error) {
      setErrors({
        submit: 'Login failed. Please try again.',
      });
      addToast({ type: 'error', message: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast container - overlays top-right */}
      <ToastMessage toasts={toasts} removeToast={removeToast} />

      <div
        className="min-h-screen flex items-center justify-center py-4 sm:py-8 px-4"
        style={{ backgroundColor: '#F6F6F6' }}
      >
        <div
          className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
          style={{ maxWidth: '1100px' }}
        >
          <div className="flex flex-col lg:flex-row min-h-[500px] sm:min-h-[650px]">
            {/* Left Column - Login Form */}
            <div className="w-full lg:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex flex-col max-w-md mx-auto w-full">
                {/* Logo and Title Section */}
                <div className="text-center mb-8 sm:mb-10">
                  <div
                    className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6 rounded-full shadow-lg"
                    style={{ backgroundColor: '#F6F6F6' }}
                  >
                    <img
                      src="/brgy talipapa.png"
                      alt="Barangay Talipapa Logo"
                      className="h-20 w-20 sm:h-28 sm:w-28 object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h1
                    className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3"
                    style={{ color: '#1a4d2e' }}
                  >
                    Admin Portal
                  </h1>
                </div>

                {/* Login Text */}
                <p
                  className="text-base sm:text-lg mb-6 sm:mb-8 text-center"
                  style={{ color: '#838383' }}
                >
                  Please login to your account
                </p>

                {/* Form */}
                <div className="w-full">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 sm:space-y-8"
                    noValidate
                  >
                    {/* Username Field */}
                    <div>
                      <label
                        htmlFor="form1"
                        className="block text-sm font-semibold mb-2 sm:mb-3"
                        style={{ color: '#1a4d2e' }}
                      >
                        Username
                      </label>
                      <Input
                        id="form1"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className={`w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border-2 rounded-xl text-sm sm:text-base placeholder:text-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#1a4d2e] hover:border-gray-300'}`}
                        disabled={loading}
                      />
                      {errors.username && (
                        <p className="text-xs sm:text-sm text-red-600 mt-2 font-medium">
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="form2"
                        className="block text-sm font-semibold mb-2 sm:mb-3"
                        style={{ color: '#1a4d2e' }}
                      >
                        Password
                      </label>
                      <Input
                        id="form2"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border-2 rounded-xl text-sm sm:text-base placeholder:text-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#1a4d2e] hover:border-gray-300'}`}
                        disabled={loading}
                      />
                      {errors.password && (
                        <p className="text-xs sm:text-sm text-red-600 mt-2 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                        <p className="text-xs sm:text-sm text-red-600 font-medium">
                          {errors.submit}
                        </p>
                      </div>
                    )}

                    {/* Submit Button and Links */}
                    <div className="pt-2 sm:pt-4">
                      <Button
                        type="submit"
                        className="w-full h-14 sm:h-16 text-white font-bold rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
                        style={{ backgroundColor: '#1a4d2e' }}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                            <span>Signing in...</span>
                          </div>
                        ) : (
                          'Sign in'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Branding */}
            <div
              className="hidden lg:flex w-full lg:w-1/2 flex-col justify-center text-white p-12 lg:p-16 relative overflow-hidden"
              style={{ backgroundColor: '#1a4d2e' }}
            >
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

              <div className="relative z-10 text-center px-4 lg:px-8">
                <h4 className="text-4xl lg:text-5xl font-black mb-6 lg:mb-8 leading-tight">
                  Welcome Back,
                  <br />
                  Admin
                </h4>
                <p className="text-white/90 text-base lg:text-lg leading-relaxed font-light">
                  Access the comprehensive Barangay Content Management System.
                  Manage community services, resources, news, and user accounts
                  efficiently. Your administrative dashboard provides complete
                  control over the barangay's digital presence and community
                  engagement platform.
                </p>

                {/* Additional decorative element */}
                <div className="mt-10 lg:mt-12 flex justify-center space-x-3">
                  <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
                  <div className="w-3 h-3 bg-white rounded-full opacity-75"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default AdminLogin;
