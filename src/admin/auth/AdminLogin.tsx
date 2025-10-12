import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, setLoading } = useAuth();

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
      return;
    }

    setLoading(true);
    try {
      const success = await login(formData.username, formData.password);

      if (success) {
        // Redirect to the intended page or dashboard
        const from =
          (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;
        navigate(from, { replace: true });
      } else {
        setErrors({
          submit: 'Invalid username or password',
        });
      }
    } catch (error) {
      setErrors({
        submit: 'Login failed. Please try again.',
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
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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
  );
};

export default AdminLogin;
