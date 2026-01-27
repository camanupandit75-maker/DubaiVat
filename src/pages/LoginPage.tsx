import React, { useState } from 'react';
import { Calculator, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { setCurrentPage, setUser, setShowOnboarding } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: '1',
      name: 'Ahmed Al Mansouri',
      email: email,
      businessName: "Ahmed's Trading LLC",
      trn: '100234567891234',
      accountType: 'business'
    });
    setShowOnboarding(true);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4B7F] to-[#153d6b] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Calculator className="text-[#C5A572]" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[#1B4B7F] mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Dubai Tax Assistant account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-[#1B4B7F] focus:ring-[#1B4B7F]"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setCurrentPage('forgot-password')}
              className="text-sm text-[#1B4B7F] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('register')}
              className="text-[#1B4B7F] font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium text-gray-700">Apple</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
