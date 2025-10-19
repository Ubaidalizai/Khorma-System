import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast.success('ورود موفقیت‌آمیز بود');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'خطا در ورود به سیستم');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      backgroundColor: 'var(--background)',
      fontFamily: 'var(--font-family)'
    }}>
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--primary-brown)' }}>
            ورود به سیستم
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-medium)' }}>
            سیستم مدیریت تجارت و توزیع
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                ایمیل
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-dark)',
                  focusRingColor: 'var(--primary-brown)'
                }}
                placeholder="ایمیل خود را وارد کنید"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-dark)',
                  focusRingColor: 'var(--primary-brown)'
                }}
                placeholder="رمز عبور خود را وارد کنید"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: isLoading ? 'var(--text-medium)' : 'var(--primary-brown)',
                focusRingColor: 'var(--primary-brown)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  در حال ورود...
                </div>
              ) : (
                'ورود'
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-md" style={{ backgroundColor: 'var(--beige-light)' }}>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              اطلاعات ورود آزمایشی:
            </h3>
            <div className="text-xs space-y-1" style={{ color: 'var(--text-medium)' }}>
              <p><strong>ایمیل:</strong> admin@example.com</p>
              <p><strong>رمز عبور:</strong> password123</p>
            </div>
            <div className="mt-2 text-xs" style={{ color: 'var(--text-medium)' }}>
              <p><em>توجه: برای ورود از ایمیل و رمز عبور بالا استفاده کنید</em></p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
