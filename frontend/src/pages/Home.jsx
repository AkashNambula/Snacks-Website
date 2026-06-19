import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShoppingBag, ArrowRight, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div 
      className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center bg-brand-dark text-brand-cream bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(42, 23, 12, 0.95), rgba(61, 35, 20, 0.75)), url("/assets/images/hero_banner.png")'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-brand-dark/20 backdrop-blur-[1px]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center text-center sm:text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl md:max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 bg-brand-bronze/30 text-brand-cream border border-brand-bronze/50 rounded-full px-4.5 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4 text-brand-bronze" />
            <span>100% Traditional Andhra Homemade Snacks</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Savor the Crunch of <span className="text-brand-bronze">Traditional Love</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed">
            Experience the pure joy of homemade delicacies prepared using grandmother's secret recipes. Freshly fried in premium sunflower oil, hygienically packed, and delivered to your doorstep.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
            {user?.role === 'ADMIN' ? (
              <Link
                to="/admin"
                className="w-full sm:w-auto bg-brand-bronze hover:bg-brand-light text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-darker/50 hover:shadow-brand-bronze/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Go to Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/products"
                className="w-full sm:w-auto bg-brand-bronze hover:bg-brand-light text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-brand-darker/50 hover:shadow-brand-bronze/30 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Shop Snacks Now</span>
              </Link>
            )}
            <Link
              to="/about"
              className="w-full sm:w-auto border border-brand-cream/40 hover:border-brand-cream hover:bg-brand-cream/10 text-brand-cream px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Read Our Story</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
