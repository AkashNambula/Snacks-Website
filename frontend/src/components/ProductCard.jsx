import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const weights = product.weights || [];
  
  // Set default weight if available
  const [selectedWeight, setSelectedWeight] = useState(
    weights.length > 0 ? weights[0].weight : '250 Grams'
  );

  const [isAdded, setIsAdded] = useState(false);

  // Find price based on weight
  const matchedWeight = weights.find((w) => w.weight === selectedWeight);
  const currentPrice = matchedWeight ? matchedWeight.price : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const res = await addToCart(product, selectedWeight, 1);
    if (res.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product, selectedWeight, 1);
    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-brand-cream/40 overflow-hidden flex flex-col group transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Link */}
      <Link to={`/products/${product.id}`} className="relative block overflow-hidden aspect-video bg-brand-cream/20">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop'}
          alt={product.productName}
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-brand-dark/80 text-brand-cream text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <Link to={`/products/${product.id}`}>
            <h3 className="text-lg font-bold text-brand-dark hover:text-brand-bronze transition-colors">
              {product.productName}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4">
          {/* Weight Selection Dropdown */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <span className="text-gray-400 font-medium">Select Weight:</span>
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="bg-brand-creamlight border border-gray-200 text-brand-dark font-bold text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-bronze transition-colors cursor-pointer"
            >
              {weights.map((w) => (
                <option key={w.id} value={w.weight}>
                  {w.weight}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Info */}
          <div className="flex items-baseline justify-between mb-4 border-t border-brand-cream/30 pt-3">
            <span className="text-gray-400 text-xs font-semibold">Total Price:</span>
            <span className="text-xl font-extrabold text-brand-dark">
              ₹{parseFloat(currentPrice).toFixed(2)}
            </span>
          </div>

          {/* Action Buttons */}
          {(!user || user.role !== 'ADMIN') && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center space-x-1 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isAdded
                    ? 'bg-green-600 text-white shadow-green-100 shadow-md'
                    : 'bg-brand-cream text-brand-dark border border-brand-light/20 hover:bg-brand-dark hover:text-brand-cream hover:border-brand-dark'
                }`}
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>{isAdded ? 'Added!' : 'Add to Cart'}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex items-center justify-center space-x-1 bg-brand-bronze hover:bg-brand-light text-white py-2.5 rounded-lg text-xs font-bold shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 transition-all duration-200"
              >
                <span>Buy Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
