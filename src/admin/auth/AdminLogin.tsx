import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield, AlertTriangle, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { APP_ROUTES } from '../../utils/constants/routes';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { useLoginRateLimiter } from '../../hooks/useLoginRateLimiter';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submission
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, setLoading } = useAuth();
  const { success, error } = useToast();

  // Rate limiting hook
  const {
    isLocked,
    remainingAttempts,
    remainingLockoutSeconds,
    attemptCount,
    canAttemptLogin,
    checkCanLogin,
    recordLoginAttempt,
    getLockoutMessage,
    getRemainingAttemptsMessage,
    getProgressPercentage,
  } = useLoginRateLimiter();

  // Check lockout status for the CURRENT username being typed
  const [currentUserLocked, setCurrentUserLocked] = useState(false);
  const [currentUserLockoutSeconds, setCurrentUserLockoutSeconds] = useState(0);

  useEffect(() => {
    // If username field is not empty, check its specific lockout status
    if (formData.username.trim()) {
      const canLogin = checkCanLogin(formData.username);
      setCurrentUserLocked(!canLogin);

      // If this username is locked, update the countdown for this specific user
      if (!canLogin && isLocked) {
        setCurrentUserLockoutSeconds(remainingLockoutSeconds);
      }
    } else {
      // No username typed, use general lockout state
      setCurrentUserLocked(isLocked);
      setCurrentUserLockoutSeconds(remainingLockoutSeconds);
    }
  }, [formData.username, isLocked, remainingLockoutSeconds, checkCanLogin]);

  // Use the current user's lockout state for rendering
  const isCurrentlyLocked = formData.username.trim()
    ? currentUserLocked
    : isLocked;
  const currentLockoutSeconds = formData.username.trim()
    ? currentUserLockoutSeconds
    : remainingLockoutSeconds;

  // Sync lockout status with backend on component mount
  useEffect(() => {
    const syncLockoutStatus = async () => {
      if (!formData.username) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/lockout-status/${formData.username}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const data = await response.json();

          // If backend says locked but frontend doesn't know, sync the state
          if (data.isLocked && !isLocked) {
            // This will be handled by the rate limiter's internal logic
            console.log('Backend lockout detected:', data);
          }
        }
      } catch (err) {
        // Fallback to localStorage-based rate limiting if backend unavailable
        console.log('Using client-side rate limiting (backend unavailable)');
      }
    };

    // Sync when username changes
    if (formData.username.length > 0) {
      syncLockoutStatus();
    }
  }, [formData.username]);

  // Redirect if already logged in (BUT NOT if locked out)
  useEffect(() => {
    // Don't redirect if user is locked out
    if (isCurrentlyLocked) {
      return;
    }

    if (isAuthenticated) {
      const from =
        (location.state as any)?.from?.pathname || APP_ROUTES.ADMIN.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isCurrentlyLocked]);

  // Show logout success toast if redirected from logout
  useEffect(() => {
    // Don't show logout toast if locked out
    if (isCurrentlyLocked) {
      return;
    }

    if (location.state?.logoutSuccess) {
      success('Logout successful! 👋', {
        title: 'See you later!',
        duration: 3000,
      });
      // prevent showing again if user refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, success, isCurrentlyLocked]);

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

    // CRITICAL: Prevent ANY submission if locked - check FIRST
    if (isCurrentlyLocked) {
      const message = getLockoutMessage();
      error(message, {
        title: '🔒 Account Locked',
        duration: 5000,
      });
      return;
    }

    // Prevent double submission
    if (isSubmitting || loading) {
      return;
    }

    // Validate form first
    if (!validateForm()) {
      return; // Don't show toast for validation - errors are shown inline
    }

    // Check rate limiting after validation passes
    const canLogin = checkCanLogin(formData.username);
    if (!canLogin) {
      // Show lockout message
      const message = getLockoutMessage();
      error(message, {
        title: '🔒 Account Locked',
        duration: 5000,
      });
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const loginSuccess = await login(formData.username, formData.password);

      if (loginSuccess) {
        // Record successful attempt (clears lockout)
        recordLoginAttempt(formData.username, true);

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
        // Record failed attempt FIRST, then get updated state
        recordLoginAttempt(formData.username, false);

        // Clear password field immediately after failed attempt
        setFormData((prev) => ({
          ...prev,
          password: '',
        }));

        // Small delay to allow state to update
        setTimeout(() => {
          setErrors({
            submit: 'Invalid username or password',
          });

          // Get CURRENT remaining attempts after recording
          const currentRemaining = remainingAttempts;

          if (currentRemaining === 0 && isLocked) {
            // Account just got locked
            error(
              `Too many failed attempts. Your account has been locked for 15 minutes.`,
              {
                title: '🔒 Account Locked',
                duration: 7000,
              }
            );
          } else if (currentRemaining === 1) {
            error(
              `Invalid credentials. ⚠️ FINAL WARNING: Account will be locked for 15 minutes after the next failed attempt.`,
              {
                title: '🚨 Critical Warning',
                duration: 8000,
              }
            );
          } else if (currentRemaining === 2) {
            error(
              `Invalid credentials. ⚠️ WARNING: Only ${currentRemaining} attempts remaining before 15-minute lockout.`,
              {
                title: '⚠️ Security Alert',
                duration: 6000,
              }
            );
          } else if (currentRemaining === 3) {
            error(
              `Invalid credentials. ${currentRemaining} attempts remaining before lockout.`,
              {
                title: '⚠️ Login Failed',
                duration: 5000,
              }
            );
          } else {
            error(
              'Invalid username or password. Please check your credentials.',
              {
                title: 'Login Failed',
                duration: 4000,
              }
            );
          }
        }, 50); // Small delay for state update
      }
    } catch (err) {
      // Record failed attempt even on network errors
      recordLoginAttempt(formData.username, false);

      // Clear password field on network error
      setFormData((prev) => ({
        ...prev,
        password: '',
      }));

      setErrors({
        submit: 'Login failed. Please try again.',
      });
      error('Connection error. Please check your internet and try again.', {
        title: 'Network Error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Render full-screen enterprise lockout modal when locked
  // This check happens FIRST, before any other rendering logic
  // Check if the CURRENT username being typed is locked
  if (isCurrentlyLocked) {
    const minutes = Math.floor(currentLockoutSeconds / 60);
    const seconds = currentLockoutSeconds % 60;
    const totalLockoutSeconds = 15 * 60; // 15 minutes
    const progressPercent =
      currentLockoutSeconds > 0
        ? ((totalLockoutSeconds - currentLockoutSeconds) /
            totalLockoutSeconds) *
          100
        : 0;

    return (
      <div
        className="fixed inset-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-3 sm:p-4 md:p-6 z-[10000] overflow-y-auto"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="w-full max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl my-auto">
          {/* Enterprise-Grade Lockout Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border-2 sm:border-3 md:border-4 border-red-500 overflow-hidden">
            {/* Animated Danger Header with Gradient */}
            <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-3 sm:p-5 md:p-8 text-white overflow-hidden">
              {/* Animated background pulse */}
              <div className="absolute inset-0 bg-red-900 opacity-20 animate-pulse"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl ring-2 sm:ring-3 md:ring-4 ring-white/30 animate-pulse">
                    <Lock
                      className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 text-white drop-shadow-lg"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-1 sm:mb-2 md:mb-3 drop-shadow-lg">
                  🔒 Account Locked
                </h2>
                <p className="text-red-100 text-center text-xs sm:text-sm md:text-base lg:text-lg font-medium">
                  Security Protection Active
                </p>
                <div className="mt-2 sm:mt-3 md:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-red-200 flex-wrap">
                  <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-center">
                    Too Many Failed Login Attempts
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-3 sm:p-5 md:p-8 lg:p-10 space-y-3 sm:space-y-5 md:space-y-8">
              {/* Massive Timer Display */}
              <div className="text-center">
                <div className="w-full">
                  <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 rounded-xl sm:rounded-2xl md:rounded-3xl px-3 sm:px-6 md:px-12 py-3 sm:py-5 md:py-8 shadow-xl border-2 sm:border-3 md:border-4 border-red-300">
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-red-700 mb-1.5 sm:mb-2 md:mb-3 uppercase tracking-wider sm:tracking-widest">
                      ⏱️ Time Remaining
                    </p>
                    <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 font-mono tabular-nums drop-shadow-lg">
                      {String(minutes).padStart(2, '0')}:
                      {String(seconds).padStart(2, '0')}
                    </div>
                    <div className="mt-1.5 sm:mt-2 md:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-4 text-[10px] sm:text-xs md:text-sm font-semibold text-red-600 flex-wrap">
                      <span className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-red-100 rounded-full whitespace-nowrap">
                        MINUTES
                      </span>
                      <span className="text-red-400">:</span>
                      <span className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 bg-red-100 rounded-full whitespace-nowrap">
                        SECONDS
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Progress Bar with Gradient */}
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-gray-700">
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
                    <span className="text-[10px] sm:text-xs md:text-sm">
                      Lockout Progress
                    </span>
                  </div>
                  <span className="font-mono text-xs sm:text-sm md:text-lg text-red-600">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="relative h-3 sm:h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                  {/* Background grid pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(90deg, transparent, transparent 10px, #000 10px, #000 11px)',
                    }}
                  ></div>

                  {/* Animated progress bar */}
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600 transition-all duration-1000 ease-linear rounded-full relative overflow-hidden"
                    style={{ width: `${progressPercent}%` }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Multi-tier Warning Box with Icons */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border-l-3 sm:border-l-4 md:border-l-8 border-red-600 p-2.5 sm:p-3 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg">
                <div className="flex items-start gap-1.5 sm:gap-2 md:gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Shield
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-red-900 mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-wrap">
                      <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                      <span className="leading-tight">
                        Security Protection Active
                      </span>
                    </h3>
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2 text-[10px] sm:text-xs md:text-sm text-red-800 font-medium">
                      <div className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                        <span className="text-red-600 font-bold flex-shrink-0 leading-tight">
                          •
                        </span>
                        <p className="leading-snug">
                          Your account has been temporarily locked due to
                          multiple failed login attempts
                        </p>
                      </div>
                      <div className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                        <span className="text-red-600 font-bold flex-shrink-0 leading-tight">
                          •
                        </span>
                        <p className="leading-snug">
                          This is an automatic security measure to protect
                          against unauthorized access
                        </p>
                      </div>
                      <div className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                        <span className="text-red-600 font-bold flex-shrink-0 leading-tight">
                          •
                        </span>
                        <p className="leading-snug">
                          You can try logging in again after the countdown
                          reaches zero
                        </p>
                      </div>
                      <div className="flex items-start gap-1 sm:gap-1.5 md:gap-2">
                        <span className="text-red-600 font-bold flex-shrink-0 leading-tight">
                          •
                        </span>
                        <p className="leading-snug">
                          The page will automatically refresh when the lockout
                          expires
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-5 border border-gray-300 sm:border-2 shadow-md">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-red-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase truncate leading-tight">
                        Failed Attempts
                      </p>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-red-600">
                        {attemptCount}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-5 border border-gray-300 sm:border-2 shadow-md">
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-orange-500 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-gray-600 uppercase truncate leading-tight">
                        Lockout Duration
                      </p>
                      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-orange-600">
                        15 min
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div className="text-center pt-2 sm:pt-3 md:pt-4 border-t border-gray-200 sm:border-t-2">
                <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-700 mb-1 sm:mb-1.5 md:mb-2">
                  Need Assistance?
                </p>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 leading-snug">
                  If you believe this is an error, please contact your system
                  administrator
                </p>
              </div>
            </div>

            {/* Footer with Auto-refresh Notice */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-2 sm:px-4 md:px-10 py-2 sm:py-3 md:py-5 border-t border-gray-200 sm:border-t-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-gray-700">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Auto-refresh enabled</span>
                </div>
                <span className="hidden sm:inline text-gray-500">•</span>
                <span className="text-gray-600 text-center text-[9px] sm:text-[10px] md:text-xs leading-snug">
                  Page will reload when timer expires
                </span>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="text-center mt-3 sm:mt-4 md:mt-6 px-2">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Barangay Talipapa Admin Portal
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Enterprise-Grade Security Protection
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                      disabled={loading || isCurrentlyLocked}
                      autoComplete="username"
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
                        disabled={loading || isCurrentlyLocked}
                        autoComplete="current-password"
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
                  {errors.submit && !isLocked && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-red-600 font-medium">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  {/* Rate Limit Warning */}
                  {attemptCount > 0 && !isLocked && remainingAttempts <= 3 && (
                    <div
                      className={`rounded-xl p-4 sm:p-5 border-2 transition-all duration-300 ${
                        remainingAttempts === 1
                          ? 'bg-red-50 border-red-400'
                          : 'bg-yellow-50 border-yellow-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            remainingAttempts === 1
                              ? 'bg-red-100'
                              : 'bg-yellow-100'
                          }`}
                        >
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              remainingAttempts === 1
                                ? 'text-red-600'
                                : 'text-yellow-600'
                            } flex-shrink-0`}
                          />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm sm:text-base font-bold mb-1 ${
                              remainingAttempts === 1
                                ? 'text-red-900'
                                : 'text-yellow-900'
                            }`}
                          >
                            {remainingAttempts === 1
                              ? '🚨 Critical Warning'
                              : '⚠️ Security Alert'}
                          </p>
                          <p
                            className={`text-xs sm:text-sm ${
                              remainingAttempts === 1
                                ? 'text-red-800'
                                : 'text-yellow-800'
                            }`}
                          >
                            {getRemainingAttemptsMessage()}
                          </p>
                          <p
                            className={`text-xs mt-2 italic ${
                              remainingAttempts === 1
                                ? 'text-red-700'
                                : 'text-yellow-700'
                            }`}
                          >
                            {remainingAttempts === 1
                              ? '⏰ Your account will be locked for 15 minutes after the next failed attempt.'
                              : `⏰ Account will be locked for 15 minutes after ${remainingAttempts} more failed attempts.`}
                          </p>
                          {/* Progress bar */}
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                remainingAttempts === 1
                                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                                  : remainingAttempts === 2
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                    : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              }`}
                              style={{ width: `${getProgressPercentage()}%` }}
                            />
                          </div>
                          <div className="mt-1.5 flex justify-between text-xs font-medium">
                            <span
                              className={
                                remainingAttempts === 1
                                  ? 'text-red-700'
                                  : 'text-yellow-700'
                              }
                            >
                              {5 - remainingAttempts} failed
                            </span>
                            <span
                              className={
                                remainingAttempts === 1
                                  ? 'text-red-700'
                                  : 'text-yellow-700'
                              }
                            >
                              {remainingAttempts} remaining
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lockout Message */}
                  {isLocked && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-400 rounded-xl p-5 sm:p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-full shadow-md animate-pulse">
                          <Lock className="w-7 h-7 text-red-600 flex-shrink-0" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-base sm:text-lg text-red-900 font-bold">
                              🔒 Account Temporarily Locked
                            </p>
                          </div>

                          <div className="bg-white/60 rounded-lg p-3 mb-3 border border-red-200">
                            <p className="text-sm sm:text-base text-red-800 font-semibold">
                              {getLockoutMessage()}
                            </p>
                          </div>

                          {/* Enhanced Countdown Timer */}
                          <div className="bg-white/80 rounded-lg p-4 border border-red-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-red-600" />
                                <span className="text-xs sm:text-sm font-semibold text-red-800">
                                  Time Remaining
                                </span>
                              </div>
                              <span className="text-2xl sm:text-3xl font-mono font-bold text-red-700 tabular-nums">
                                {Math.floor(remainingLockoutSeconds / 60)}:
                                {String(remainingLockoutSeconds % 60).padStart(
                                  2,
                                  '0'
                                )}
                              </span>
                            </div>

                            <div className="relative bg-red-100 rounded-full h-3 w-full shadow-inner overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-1000 ease-linear shadow-md"
                                style={{
                                  width: `${Math.max(0, (remainingLockoutSeconds / 900) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Information Box */}
                          <div className="mt-4 bg-red-900/10 border border-red-300 rounded-lg p-3">
                            <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
                              <span className="font-bold">
                                🛡️ Security Protection Active:
                              </span>{' '}
                              Multiple failed login attempts have been detected.
                              This temporary lockout helps protect your account
                              from unauthorized access attempts. The lockout
                              will automatically expire after the countdown
                              completes.
                            </p>
                          </div>

                          {/* Help Text */}
                          <div className="mt-3 flex items-start gap-2 text-xs text-red-700">
                            <span>💡</span>
                            <p className="italic">
                              If you've forgotten your password or need
                              immediate access, please contact the system
                              administrator.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 sm:pt-4">
                    <Button
                      type="submit"
                      className={`w-full h-14 sm:h-16 text-white font-bold rounded-xl text-base sm:text-lg shadow-lg transition-all duration-300 ${
                        isCurrentlyLocked || !canAttemptLogin
                          ? 'bg-gray-400 cursor-not-allowed opacity-60'
                          : 'hover:shadow-xl hover:opacity-90'
                      }`}
                      style={{
                        backgroundColor:
                          isCurrentlyLocked || !canAttemptLogin
                            ? '#9CA3AF'
                            : '#1a4d2e',
                      }}
                      disabled={
                        loading || isCurrentlyLocked || !canAttemptLogin
                      }
                    >
                      {isCurrentlyLocked ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <Lock className="w-5 h-5" />
                          <span>Account Locked</span>
                        </div>
                      ) : loading ? (
                        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        'Sign in'
                      )}
                    </Button>

                    {/* Security Info */}
                    {!isCurrentlyLocked && attemptCount === 0 && (
                      <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                        <Shield className="w-3 h-3" />
                        Protected by anti-brute-force security
                      </p>
                    )}
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
