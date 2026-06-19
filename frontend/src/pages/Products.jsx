import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, RefreshCw, Leaf, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);
  
  // Catalogue selection tab
  const [mainSection, setMainSection] = useState('Snacks'); // 'Snacks' or 'Pickles'

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Snack filter sub-states
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pickle filter sub-states
  const [pickleType, setPickleType] = useState('All'); // 'All', 'Veg', 'Non-Veg'
  const [pickleColor, setPickleColor] = useState('All'); // 'All', 'Red', 'Green'

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error loading products', err);
      setError('Could not load products. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on active main tab, search query, and sub-filters
  const filteredProducts = products.filter((product) => {
    // 1. Filter by Main Section
    if (mainSection === 'Snacks') {
      const isSnack = product.type === 'Snack' || !product.type || product.category === 'Savory' || product.category === 'Premium';
      if (!isSnack) return false;

      const matchesSearch = 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = 
        selectedCategory === 'All' || 
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    } else {
      const isPickle = product.type === 'Pickle' || product.category.toLowerCase().includes('pickle');
      if (!isPickle) return false;

      const matchesSearch = 
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPickleType =
        pickleType === 'All' ||
        (pickleType === 'Veg' && (product.pickleType === 'Veg' || (product.category && product.category.toLowerCase().includes('veg') && !product.category.toLowerCase().includes('non-veg')))) ||
        (pickleType === 'Non-Veg' && (product.pickleType === 'Non-Veg' || (product.category && product.category.toLowerCase().includes('non-veg'))));

      const matchesPickleColor =
        pickleColor === 'All' ||
        (pickleColor === 'Red' && (product.pickleColor === 'Red' || !product.productName.toLowerCase().includes('gongura'))) ||
        (pickleColor === 'Green' && (product.pickleColor === 'Green' || product.productName.toLowerCase().includes('gongura')));

      return matchesSearch && matchesPickleType && matchesPickleColor;
    }
  });

  const categories = ['All', 'Savory', 'Premium'];

  return (
    <div className="bg-brand-creamlight min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-brand-dark/5 p-1.5 rounded-2xl flex items-center space-x-1 border border-brand-cream/40 shadow-sm">
            <button
              onClick={() => {
                setMainSection('Snacks');
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                mainSection === 'Snacks'
                  ? 'bg-brand-dark text-brand-cream shadow-md shadow-brand-dark/20'
                  : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
              }`}
            >
              <span>Andhra Snacks</span>
            </button>
            <button
              onClick={() => {
                setMainSection('Pickles');
                setSearchQuery('');
                setPickleType('All');
                setPickleColor('All');
              }}
              className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                mainSection === 'Pickles'
                  ? 'bg-brand-dark text-brand-cream shadow-md shadow-brand-dark/20'
                  : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
              }`}
            >
              <span>Traditional Pickles</span>
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark transition-all duration-300">
            {mainSection === 'Snacks' ? 'Our Traditional Snack Catalogue' : 'Our Traditional Pickle Catalogue'}
          </h1>
          <p className="text-sm text-gray-500 mt-2 transition-all duration-300">
            {mainSection === 'Snacks' 
              ? 'Freshly prepared home-style snack items. Pure, delicious, and crunchy Andhra snacks.' 
              : 'Spicy, tangy, and authentic homemade Andhra pickles. Prepared with fresh oil and traditional spices.'}
          </p>
        </div>

        {/* Search and Filters panel */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-cream/30 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="h-5 w-5" />
            </span>
            <input
              type="text"
              placeholder={mainSection === 'Snacks' ? 'Search snacks (e.g. Murukulu)...' : 'Search pickles (e.g. Tomato Pickle)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-creamlight border border-gray-200 text-brand-dark text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze/30 transition-all duration-200"
            />
          </div>

          {/* Category Filter Pills (Snacks) */}
          {mainSection === 'Snacks' ? (
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-gray-400 font-medium mr-2 flex items-center">
                <Filter className="h-4 w-4 mr-1 text-brand-light" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-bronze text-white shadow-md shadow-brand-bronze/20'
                      : 'bg-brand-creamlight text-brand-dark border border-gray-100 hover:bg-brand-cream/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : (
            /* Pickle sub-filters (Veg/Non-veg and Red/Green) */
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full md:w-auto">
              
              {/* Veg vs Non-Veg */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider mr-1">Type:</span>
                {['All', 'Veg', 'Non-Veg'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setPickleType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                      pickleType === type
                        ? 'bg-brand-bronze text-white shadow-md shadow-brand-bronze/20'
                        : 'bg-brand-creamlight text-brand-dark border border-gray-100 hover:bg-brand-cream/30'
                    }`}
                  >
                    {type === 'Veg' && <Leaf className="h-3 w-3 text-green-600 shrink-0" />}
                    {type === 'Non-Veg' && <Flame className="h-3 w-3 text-red-600 shrink-0" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>

              {/* Red vs Green */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider mr-1">Color:</span>
                {['All', 'Red', 'Green'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPickleColor(color)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                      pickleColor === color
                        ? 'bg-brand-dark text-brand-cream shadow-md'
                        : 'bg-brand-creamlight text-brand-dark border border-gray-100 hover:bg-brand-cream/30'
                    }`}
                  >
                    {color === 'Red' && <span className="h-2 w-2 rounded-full bg-red-600 shrink-0" />}
                    {color === 'Green' && <span className="h-2 w-2 rounded-full bg-green-600 shrink-0" />}
                    <span>{color}</span>
                  </button>
                ))}
              </div>

            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-bronze"></div>
            <p className="text-xs text-gray-400 mt-4">Loading fresh items...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center max-w-lg mx-auto">
            <p className="font-bold mb-2">{error}</p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center space-x-1 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-brand-cream/30 p-16 rounded-2xl text-center max-w-lg mx-auto shadow-sm">
            <p className="text-brand-dark font-bold text-lg mb-2">No Items Found</p>
            <p className="text-gray-400 text-sm">
              We couldn't find any items matching your criteria. Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
