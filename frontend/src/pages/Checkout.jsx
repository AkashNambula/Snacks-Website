import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { ArrowLeft, Send, CheckCircle2, ShoppingBag, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart, getItemPrice } = useCart();
  const navigate = useNavigate();

  // Address form state
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [mobileNumber, setMobileNumber] = useState('');
  const [secondMobileNumber, setSecondMobileNumber] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('');
  const [areaDetails, setAreaDetails] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Fetch saved user data
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true });
      return;
    }
    const fetchUserData = async () => {
      try {
        // Fetch phone from profile me details
        const meRes = await api.get('/api/auth/me');
        setFullName(meRes.data.fullName);
        setEmail(meRes.data.email);
        setMobileNumber(meRes.data.mobileNumber || '');

        // Fetch address
        const addressRes = await api.get('/api/orders/address');
        if (addressRes.data && addressRes.data.address) {
          const rawAddress = addressRes.data.address;
          // Parse if it was combined:
          const areaMatch = rawAddress.match(/Area:\s*(.*)/);
          const altPhoneMatch = rawAddress.match(/Alt Phone:\s*(.*)/);
          
          let cleanAddress = rawAddress;
          if (areaMatch) {
            cleanAddress = cleanAddress.split('\nArea:')[0];
            setAreaDetails(areaMatch[1]);
          }
          if (altPhoneMatch) {
            setSecondMobileNumber(altPhoneMatch[1]);
          }

          setAddress(cleanAddress);
          setCity(addressRes.data.city);
          setState(addressRes.data.state);
          setPincode(addressRes.data.pincode);
        }
      } catch (err) {
        console.error('Failed to load user address profile', err);
      } finally {
        setAddressLoading(false);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  // If cart is empty and order wasn't just placed successfully, redirect to cart
  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, orderSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !mobileNumber || !email || !address || !areaDetails || !city || !state || !pincode) {
      setError('Please fill in all the required delivery details.');
      return;
    }

    if (mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
      setError('Mobile number must be a valid 10-digit number.');
      return;
    }

    if (secondMobileNumber && (secondMobileNumber.length !== 10 || !/^\d+$/.test(secondMobileNumber))) {
      setError('Secondary mobile number must be a valid 10-digit number.');
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setError('Pincode must be a valid 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Save Address details to user profile
      const combinedAddress = `${address}\nArea: ${areaDetails}\nAlt Phone: ${secondMobileNumber}`;
      await api.post('/api/orders/address', {
        address: combinedAddress,
        city,
        state,
        pincode
      });

      // 2. Place Order (Checkout)
      const orderRes = await api.post('/api/orders/checkout');
      const orderData = orderRes.data;
      
      setPlacedOrder(orderData);
      setOrderSuccess(true);
      
      // 3. Generate WhatsApp text
      triggerWhatsAppRedirect(orderData);
      
      // 4. Clear Local Cart state
      clearCart();
    } catch (err) {
      console.error('Checkout failed', err);
      setError(err.response?.data?.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const triggerWhatsAppRedirect = (order) => {
    // Generate text message summary
    let itemsText = '';
    order.orderItems.forEach((item, idx) => {
      itemsText += `${idx + 1}. ${item.product.productName} (${item.weight}) x ${item.quantity} - ₹${parseFloat(item.price * item.quantity).toFixed(2)}\n`;
    });

    const fullAddress = `${address}\nArea Details: ${areaDetails}\nCity: ${city}, State: ${state}\nPincode: ${pincode}`;
    
    const message = `Hello Amigos Snacks,\n\nCustomer Name: ${fullName}\n\nPhone Number: ${mobileNumber}\nSecondary Phone: ${secondMobileNumber || 'N/A'}\nEmail: ${email}\n\nAddress Details:\n${fullAddress}\n\nProducts:\n${itemsText}\nTotal Amount: ₹${parseFloat(order.totalAmount).toFixed(2)}\n\nPlease confirm my order.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918341462856?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  if (orderSuccess && placedOrder) {
    return (
      <div className="bg-brand-creamlight min-h-screen py-20 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 border border-brand-cream/35 text-center max-w-lg mx-auto shadow-md flex flex-col items-center">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-brand-dark mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">
            Your Order ID is <span className="font-extrabold text-brand-dark">#{placedOrder.id}</span>. We have pre-filled your WhatsApp checkout message to complete confirmation.
          </p>

          <div className="bg-brand-creamlight/50 border border-brand-cream/30 p-5 rounded-2xl text-left w-full mb-8 text-xs space-y-2">
            <p className="font-bold text-brand-dark text-sm border-b border-brand-cream/40 pb-2 mb-2">Delivery Summary</p>
            <p><span className="text-gray-400 font-medium">Customer:</span> {fullName}</p>
            <p><span className="text-gray-400 font-medium">WhatsApp:</span> {mobileNumber}</p>
            <p><span className="text-gray-400 font-medium">Total Amount:</span> ₹{parseFloat(placedOrder.totalAmount).toFixed(2)}</p>
            <p><span className="text-gray-400 font-medium">Destination:</span> {address}, {city}, {state} - {pincode}</p>
          </div>

          <button
            onClick={() => triggerWhatsAppRedirect(placedOrder)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-md shadow-green-200 mb-4"
          >
            <Send className="h-4 w-4" />
            <span>Open WhatsApp Checkout Again</span>
          </button>
          
          <Link
            to="/dashboard"
            className="text-xs text-brand-light font-bold hover:text-brand-dark transition-colors"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-creamlight min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link to="/cart" className="inline-flex items-center space-x-2 text-brand-dark hover:text-brand-bronze font-bold text-sm mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-brand-dark mb-10">Checkout Details</h1>

        {addressLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-brand-cream/20 shadow-sm">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-bronze"></div>
            <p className="text-xs text-gray-400 mt-4">Loading shipping address details...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Delivery Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-brand-cream/30 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-brand-dark border-b border-brand-cream/20 pb-4">
                Shipping Address & Customer Info
              </h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Secondary Phone Number
                  </label>
                  <input
                    type="tel"
                    value={secondMobileNumber}
                    onChange={(e) => setSecondMobileNumber(e.target.value)}
                    placeholder="Optional alternative contact"
                    maxLength={10}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Complete Delivery Address *
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat/House No., Building Name, Street details"
                  rows={3}
                  className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Area / Landmark / Locality Details *
                </label>
                <input
                  type="text"
                  value={areaDetails}
                  onChange={(e) => setAreaDetails(e.target.value)}
                  placeholder="e.g. Near Ramalayam Temple, Danavaipeta"
                  className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-gray-500 bg-brand-creamlight p-4 rounded-xl border border-brand-cream/35">
                <ShieldCheck className="h-5 w-5 text-brand-bronze shrink-0" />
                <span>
                  We will save this address automatically in your user profile for future checkouts.
                </span>
              </div>
            </div>

            {/* Checkout Items Summary */}
            <div className="bg-white rounded-3xl p-6 border border-brand-cream/30 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-brand-dark border-b border-brand-cream/20 pb-4">
                Order Review
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
                {cartItems.map((item) => {
                  const unitPrice = getItemPrice(item);
                  return (
                    <div key={item.id} className="flex justify-between items-start text-xs border-b border-brand-cream/10 pb-3">
                      <div>
                        <p className="font-bold text-brand-dark leading-tight">{item.product.productName}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                          {item.weight}  x{item.quantity}
                        </p>
                      </div>
                      <span className="font-extrabold text-brand-dark whitespace-nowrap">
                        ₹{parseFloat(unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-xs border-t border-brand-cream/20 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Snack Subtotal</span>
                  <span className="font-semibold text-brand-dark">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping Fee</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                
                <hr className="border-brand-cream/30" />
                
                <div className="flex justify-between text-sm font-extrabold">
                  <span className="text-brand-dark">Grand Total</span>
                  <span className="text-base text-brand-dark">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-bronze hover:bg-brand-light text-white py-4 rounded-xl font-bold shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Place Order (via WhatsApp)</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default Checkout;
