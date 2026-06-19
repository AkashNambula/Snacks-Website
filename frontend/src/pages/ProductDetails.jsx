import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { ShoppingBag, ArrowLeft, Plus, Minus, Check, Shield } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch current product
        const response = await api.get(`/api/products/${id}`);
        const prodData = response.data;
        setProduct(prodData);
        
        // Set default weight
        if (prodData.weights && prodData.weights.length > 0) {
          setSelectedWeight(prodData.weights[0].weight);
        }

        // Fetch related products (same category)
        const allRes = await api.get('/api/products');
        const relatedSnacks = allRes.data.filter(
          (p) => p.category === prodData.category && p.id !== prodData.id
        );
        setRelated(relatedSnacks.slice(0, 3));
      } catch (err) {
        console.error('Error fetching product details', err);
        setError('Snack item not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    setQuantity(1); // Reset quantity on ID change
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-creamlight">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-bronze"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-creamlight px-4">
        <div className="bg-white p-8 rounded-2xl border border-brand-cream/30 text-center max-w-md shadow-sm">
          <p className="text-red-600 font-bold text-lg mb-4">{error || 'Product not found'}</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-brand-bronze text-white px-5 py-2.5 rounded-lg text-sm font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Snacks</span>
          </Link>
        </div>
      </div>
    );
  }

  const weights = product.weights || [];
  const matchedWeightObj = weights.find((w) => w.weight === selectedWeight);
  const unitPrice = matchedWeightObj ? matchedWeightObj.price : 0;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = async () => {
    const res = await addToCart(product, selectedWeight, quantity);
    if (res.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product, selectedWeight, quantity);
    navigate('/cart');
  };

  return (
    <div className="bg-brand-creamlight min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/products" className="inline-flex items-center space-x-2 text-brand-dark hover:text-brand-bronze font-bold text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Snacks Catalogue</span>
        </Link>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-brand-cream/30 grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden aspect-video sm:aspect-square bg-brand-creamlight/30 border border-brand-cream/25 shadow-inner">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop'}
              alt={product.productName}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop';
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Actions / Details Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-bronze bg-brand-cream/60 px-3 py-1.5 rounded-full inline-block mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mb-4">
                {product.productName}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-3 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg p-3.5 mb-8">
                <Shield className="h-5 w-5 text-green-600 shrink-0" />
                <span className="font-semibold">Hygienic Home Cooking Promise: Handcrafted carefully under sanitised conditions. No MSG.</span>
              </div>
            </div>

            {/* Configs */}
            <div className="border-t border-brand-cream/30 pt-6">
              
              {/* Weight Selector */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                  Choose Weight Tier:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {weights.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWeight(w.weight)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                        selectedWeight === w.weight
                          ? 'bg-brand-dark text-brand-cream border-brand-dark shadow-md shadow-brand-dark/20'
                          : 'bg-brand-creamlight text-brand-dark border-gray-200 hover:border-brand-light/30'
                      }`}
                    >
                      {w.weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Total Amount / Statically show unit price for Admins */}
              {(!user || user.role !== 'ADMIN') ? (
                <div className="mb-8 flex items-center space-x-8">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-brand-creamlight/50 p-1">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-2 rounded-lg hover:bg-brand-cream text-brand-dark focus:outline-none transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-5 font-extrabold text-brand-dark text-sm">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="p-2 rounded-lg hover:bg-brand-cream text-brand-dark focus:outline-none transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-grow text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                      Total Amount:
                    </span>
                    <span className="text-3xl font-black text-brand-dark">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mb-8 text-right border-t border-brand-cream/30 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                    Unit Price:
                  </span>
                  <span className="text-3xl font-black text-brand-dark">
                    ₹{unitPrice.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              {(!user || user.role !== 'ADMIN') && (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-sm font-extrabold shadow-sm transition-all duration-200 ${
                      isAdded
                        ? 'bg-green-600 text-white shadow-green-100'
                        : 'bg-brand-cream text-brand-dark border border-brand-light/20 hover:bg-brand-dark hover:text-brand-cream hover:border-brand-dark'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center bg-brand-bronze hover:bg-brand-light text-white py-4 rounded-xl text-sm font-extrabold shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 transition-all duration-200"
                  >
                    <span>Buy Now</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-brand-dark mb-8 border-b border-brand-cream/30 pb-4">
              You Might Also Like (Related Items)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
