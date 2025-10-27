import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, setLoading } = useAuth();
  const { success, error } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from =
        (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Show logout success toast if redirected from logout
  useEffect(() => {
    if (location.state?.logoutSuccess) {
      success('Logout successful! 👋', {
        title: 'See you later!',
        duration: 3000,
      });
      // prevent showing again if user refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, success]);

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
      // Show toast for validation error
      if (errors.username) {
        error(errors.username, { title: 'Validation Error' });
      } else if (errors.password) {
        error(errors.password, { title: 'Validation Error' });
      } else {
        error('Please check the form and try again.', { title: 'Form Error' });
      }
      return;
    }

    setLoading(true);
    try {
      const loginSuccess = await login(formData.username, formData.password);

      if (loginSuccess) {
        success('Welcome back! 🎉', {
          title: 'Login Successful',
          duration: 2000,
        });

        const destination =
          (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;

        // Small delay to show the success toast
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 500);
      } else {
        setErrors({
          submit: 'Invalid username or password',
        });
        error('Invalid username or password', {
          title: 'Login Failed',
          duration: 5000,
        });
      }
    } catch (err) {
      setErrors({
        submit: 'Login failed. Please try again.',
      });
      error('Login failed. Please try again.', {
        title: 'Connection Error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
                      className={`w-full h-12 sm:h-14 px-3 sm:px-4 bg-white border-2 rounded-xl text-sm sm:text-base placeholder:text-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                        errors.username
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#1a4d2e] hover:border-gray-300'
                      }`}
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
                    <div className="relative">
                      <Input
                        id="form2"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full h-12 sm:h-14 pr-12 px-3 sm:px-4 bg-white border-2 rounded-xl text-sm sm:text-base placeholder:text-gray-400 focus:ring-0 focus:outline-none transition-all duration-300 ${
                          errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-[#1a4d2e] hover:border-gray-300'
                        }`}
                        disabled={loading}
                      />
                      {formData.password &&
                        formData.password.trim().length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-600"
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 text-gray-700" />
                            ) : (
                              <Eye className="w-5 h-5 text-gray-700" />
                            )}
                          </button>
                        )}
                    </div>
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

                  {/* Submit Button */}
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

            <div className="relative z-[10] text-center px-4 lg:px-8">
              <h4 className="text-4xl lg:text-3xl font-black mb-6 lg:mb-8 leading-tight">
                Welcome Back, Admin
              </h4>
              <p className="text-white/90 text-base lg:text-lg leading-relaxed font-light">
                Access the comprehensive Barangay Content Management System.
                Manage community services, resources, news, and user accounts
                efficiently. Your administrative dashboard provides complete
                control over the barangay's digital presence and community
                engagement platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
