import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User, Menu, X, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    toast.success('Signed out successfully.');
    navigate('/');
  };

  return (
    <nav className="bg-brand-dark text-brand-cream sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img 
                src="/assets/images/logo.png" 
                alt="Amigos Snacks Logo" 
                className="h-12 w-12 rounded-full border border-brand-light/30 object-cover bg-white"
              />
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-brand-cream group-hover:text-brand-bronze transition-colors duration-200">
                  AMIGOS <span className="text-brand-bronze">SNACKS</span>
                </span>
                <span className="text-[9px] tracking-[0.25em] text-brand-light uppercase -mt-1 font-semibold">
                  Andhra Homemade Delights
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 font-medium">
            <Link to="/" className="hover:text-brand-bronze transition-colors duration-200 py-2">Home</Link>
            {(!user || user.role !== 'ADMIN') && (
              <Link to="/products" className="hover:text-brand-bronze transition-colors duration-200 py-2">Snacks</Link>
            )}
            <Link to="/about" className="hover:text-brand-bronze transition-colors duration-200 py-2">Our Story</Link>
            <Link to="/contact" className="hover:text-brand-bronze transition-colors duration-200 py-2">Contact Us</Link>
          </div>

          {/* User Controls & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Icon */}
            {(!user || user.role !== 'ADMIN') && (
              <Link to="/cart" className="relative group p-2 rounded-full hover:bg-brand-darker transition-colors duration-200">
                <ShoppingBag className="h-6 w-6 text-brand-cream group-hover:text-brand-bronze transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-bronze text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth Dropdown / Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-brand-darker transition-colors focus:outline-none"
                >
                  <User className="h-5 w-5 text-brand-bronze" />
                  <span className="max-w-[120px] truncate text-sm font-semibold">{user.fullName.split(' ')[0]}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl py-2 border border-brand-cream text-brand-dark z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold truncate text-brand-dark">{user.email}</p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-dark transition-colors"
                    >
                      <UserCheck className="h-4 w-4 text-brand-light" />
                      <span>My Profile</span>
                    </Link>

                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-brand-cream hover:text-brand-dark transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-brand-light" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <hr className="my-1 border-gray-100" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-semibold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-semibold hover:text-brand-bronze transition-colors py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-bronze hover:bg-brand-light text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-brand-darker/30 hover:shadow-brand-bronze/20 transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {(!user || user.role !== 'ADMIN') && (
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-brand-darker">
                <ShoppingBag className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-bronze text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-brand-darker focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6 text-brand-cream" /> : <Menu className="h-6 w-6 text-brand-cream" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-brand-darker border-t border-brand-dark px-4 pt-2 pb-6 space-y-3 font-semibold text-brand-cream">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors"
          >
            Home
          </Link>
          {(!user || user.role !== 'ADMIN') && (
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors"
            >
              Snacks
            </Link>
          )}
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors"
          >
            Our Story
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors"
          >
            Contact Us
          </Link>
          
          <hr className="border-brand-dark my-2" />
          
          {user ? (
            <>
              <div className="px-3 py-2 text-xs text-brand-light">Logged in as {user.email}</div>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors"
              >
                My Profile
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-brand-dark transition-colors text-brand-bronze"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-red-400 hover:bg-brand-dark transition-colors font-bold"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-4 py-2.5 rounded-lg border border-brand-cream/30 hover:border-brand-cream transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="text-center bg-brand-bronze hover:bg-brand-light text-white px-4 py-2.5 rounded-lg text-sm font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
