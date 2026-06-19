import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Parse redirect query param
  const query = new URLSearchParams(location.search);
  const redirect = query.get('redirect') || 'dashboard';

  useEffect(() => {
    // If already logged in, redirect away
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirect === 'dashboard' ? '/dashboard' : `/${redirect}`);
      }
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser && storedUser.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirect === 'dashboard' ? '/dashboard' : `/${redirect}`);
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-brand-creamlight min-h-screen py-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-cream/30 shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-brand-dark">Welcome Back</h2>
          <p className="text-xs text-gray-400 mt-1">Sign in to your Amigos Snacks account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@email.com"
              className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-bronze hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="border-t border-brand-cream/20 mt-8 pt-6 text-center text-xs text-gray-500">
          <span>Don't have an account? </span>
          <Link
            to={`/register${redirect !== 'dashboard' ? `?redirect=${redirect}` : ''}`}
            className="text-brand-light font-bold hover:text-brand-dark transition-colors inline-flex items-center space-x-0.5"
          >
            <span>Register Here</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>


      </div>
    </div>
  );
};

export default Login;
