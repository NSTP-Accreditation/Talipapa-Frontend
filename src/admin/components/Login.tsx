import { useToast } from '../../hooks/useToast';
import { useState } from 'react';

export default function ExampleAuthForm() {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const handleLogin = (isValid: boolean) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isValid) {
        success('Welcome back!', { title: 'Login Successful', duration: 3000 });
      } else {
        error('Wrong credentials!', { title: 'Login Failed', duration: 5000 });
      }
    }, 600);
  };

  return (
    <div className="flex flex-col items-center mt-12 space-y-4">
      <button
        onClick={() => handleLogin(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Simulate Success Login'}
      </button>
      <button
        onClick={() => handleLogin(false)}
        className="px-4 py-2 bg-red-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Simulate Failed Login'}
      </button>
    </div>
  );
}
