import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from '../../components/ui/card';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

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

    setIsLoading(true);

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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-5 px-4">
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: '1000px', width: '90vw' }}
      >
        <div className="flex min-h-[500px]">
          {/* Left Column - Login Form */}
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <div className="flex flex-col ml-8">
              {/* Logo and Title Section */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4">
                  <img
                    src="/brgy talipapa.png"
                    alt="Barangay Talipapa Logo"
                    className="h-[90px] w-[90px] object-contain hover:opacity-80 transition-opacity cursor-pointer"
                  />
                </div>
              </div>

              {/* Login Text */}
              <p className="text-gray-600 mb-6 text-center">
                Please login to your account
              </p>

              {/* Form */}
              <div className="max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username Field */}
                  <div className="mb-4">
                    <Input
                      id="form1"
                      name="username"
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full h-[48px] px-3 bg-white border-0 border-b-2 border-gray-300 rounded-none text-base placeholder:text-gray-500 focus:border-blue-500 focus:ring-0 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.username}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <Input
                      id="form2"
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-[48px] px-3 bg-white border-0 border-b-2 border-gray-300 rounded-none text-base placeholder:text-gray-500 focus:border-blue-500 focus:ring-0 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                      <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                  )}

                  {/* Submit Button and Links */}
                  <div className="text-center pt-4 mb-8">
                    <Button
                      type="submit"
                      className="w-full h-[64px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-md text-lg hover:opacity-80 transition-opacity cursor-pointer mb-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
          <div className="w-1/2 bg-gradient-to-br from-green-500 to-green-700 flex flex-col justify-center text-white p-12">
            <div className="px-6 py-8 text-center">
              <h4 className="text-3xl font-bold mb-6">Welcome Admin</h4>
              <p className="text-green-100 leading-relaxed">
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
