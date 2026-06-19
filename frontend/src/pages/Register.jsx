import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Parse redirect query param
  const query = new URLSearchParams(location.search);
  const redirect = query.get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fullName || !email || !mobileNumber || !password) {
      setError('Please fill in all the registration fields.');
      return;
    }

    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      setError('Mobile number must be a valid 10-digit number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register(fullName, email, mobileNumber, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setFullName('');
      setEmail('');
      setMobileNumber('');
      setPassword('');
      setTimeout(() => {
        navigate(`/login${redirect ? `?redirect=${redirect}` : ''}`);
      }, 2500);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="bg-brand-creamlight min-h-screen py-20 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-cream/30 shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-brand-dark">Create Account</h2>
          <p className="text-xs text-gray-400 mt-1">Join Amigos Snacks and enjoy homemade flavors</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded-xl text-xs font-semibold mb-6">
            Registration successful! Redirecting you to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Sai Kumar"
              className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
              required
            />
          </div>

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
              Mobile Number (WhatsApp)
            </label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
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
              placeholder="Minimum 6 characters"
              className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-bronze hover:bg-brand-light text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 mt-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </>
            )}
          </button>
        </form>

        <div className="border-t border-brand-cream/20 mt-8 pt-6 text-center text-xs text-gray-500">
          <span>Already have an account? </span>
          <Link
            to={`/login${redirect ? `?redirect=${redirect}` : ''}`}
            className="text-brand-light font-bold hover:text-brand-dark transition-colors inline-flex items-center space-x-0.5"
          >
            <span>Sign In</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
