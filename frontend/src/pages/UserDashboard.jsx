import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, ClipboardList, Save, CheckCircle, Smartphone, Mail, Calendar, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
  const { user } = useAuth();
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'address', 'orders'

  // Profile & Address states
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch current user details
        const meRes = await api.get('/api/auth/me');
        setProfile(meRes.data);

        // Fetch user address
        const addrRes = await api.get('/api/orders/address');
        if (addrRes.data && addrRes.data.address) {
          setAddress(addrRes.data.address);
          setCity(addrRes.data.city);
          setState(addrRes.data.state);
          setPincode(addrRes.data.pincode);
        }

        // Fetch user orders history
        const ordersRes = await api.get('/api/orders');
        setOrders(ordersRes.data);
      } catch (err) {
        console.error('Failed to load dashboard statistics', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });

    if (!address || !city || !state || !pincode) {
      setMsg({ text: 'All address fields are required.', type: 'error' });
      return;
    }

    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setMsg({ text: 'Pincode must be a 6-digit number.', type: 'error' });
      return;
    }

    setSaveLoading(true);
    try {
      await api.post('/api/orders/address', {
        address,
        city,
        state,
        pincode
      });
      setMsg({ text: 'Address updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to save address', err);
      setMsg({ text: 'Failed to update address. Try again.', type: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-creamlight">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-bronze"></div>
      </div>
    );
  }

  return (
    <div className="bg-brand-creamlight min-h-screen py-16 flex flex-col justify-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-brand-dark tracking-tight">Customer Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account details, shipping profiles, and view order histories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Sidebar Menu */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-brand-cream/35 shadow-sm space-y-6">
            
            {/* User Overview Profile Area */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-brand-cream/20">
              <div className="bg-brand-dark text-brand-cream p-4 rounded-full bg-cover">
                <User className="h-8 w-8 text-brand-bronze" />
              </div>
              <div className="max-w-full">
                <h2 className="text-lg font-black text-brand-dark leading-tight truncate">{profile?.fullName}</h2>
                <p className="text-xs text-gray-400 mt-1 truncate">{profile?.email}</p>
                <div className="mt-2.5">
                  <span className="text-[9px] uppercase font-black text-brand-bronze bg-brand-cream/50 px-2.5 py-1 rounded border border-brand-bronze/10">
                    {profile?.role} Account
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="space-y-1 font-bold text-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-brand-dark text-brand-cream shadow-md'
                    : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
                }`}
              >
                <User className="h-4.5 w-4.5" />
                <span>My Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab('address')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'address'
                    ? 'bg-brand-dark text-brand-cream shadow-md'
                    : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
                }`}
              >
                <MapPin className="h-4.5 w-4.5" />
                <span>Saved Address</span>
              </button>
              
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-brand-dark text-brand-cream shadow-md'
                    : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
                }`}
              >
                <ClipboardList className="h-4.5 w-4.5" />
                <span>Order History</span>
              </button>
            </div>

          </div>

          {/* Right Main Content Panel */}
          <div className="lg:col-span-3 w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-8 border border-brand-cream/35 shadow-sm space-y-6"
                >
                  <h3 className="text-xl font-bold text-brand-dark border-b border-brand-cream/20 pb-4 flex items-center space-x-2">
                    <User className="h-5 w-5 text-brand-bronze" />
                    <span>Profile Details</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="bg-brand-creamlight p-5 rounded-2xl border border-brand-cream/20 flex items-start space-x-4">
                      <Mail className="h-5 w-5 text-brand-bronze mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</span>
                        <p className="text-sm font-extrabold text-brand-dark mt-0.5">{profile?.email}</p>
                      </div>
                    </div>

                    <div className="bg-brand-creamlight p-5 rounded-2xl border border-brand-cream/20 flex items-start space-x-4">
                      <Smartphone className="h-5 w-5 text-brand-bronze mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">WhatsApp Phone</span>
                        <p className="text-sm font-extrabold text-brand-dark mt-0.5">+91 {profile?.mobileNumber}</p>
                      </div>
                    </div>

                    <div className="bg-brand-creamlight p-5 rounded-2xl border border-brand-cream/20 flex items-start space-x-4">
                      <Calendar className="h-5 w-5 text-brand-bronze mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Member Since</span>
                        <p className="text-sm font-extrabold text-brand-dark mt-0.5">
                          {new Date(profile?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-brand-creamlight p-5 rounded-2xl border border-brand-cream/20 flex items-start space-x-4">
                      <Heart className="h-5 w-5 text-brand-bronze mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Membership Rank</span>
                        <p className="text-sm font-extrabold text-brand-dark mt-0.5">Premium Snack Lover</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'address' && (
                <motion.div
                  key="address-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-8 border border-brand-cream/35 shadow-sm space-y-6"
                >
                  <h3 className="text-xl font-bold text-brand-dark border-b border-brand-cream/20 pb-4 flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-brand-bronze" />
                    <span>Saved Address</span>
                  </h3>

                  {msg.text && (
                    <div className={`p-4 rounded-xl text-xs font-semibold ${
                      msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveAddress} className="space-y-5">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Shipping Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Complete street address, house/flat number, landmarks details..."
                        rows={4}
                        className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        maxLength={6}
                        className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="bg-brand-bronze hover:bg-brand-light text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saveLoading ? 'Saving...' : 'Update Address'}</span>
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders-panel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white rounded-3xl p-8 border border-brand-cream/35 shadow-sm space-y-6"
                >
                  <h3 className="text-xl font-bold text-brand-dark border-b border-brand-cream/20 pb-4 flex items-center space-x-2">
                    <ClipboardList className="h-5 w-5 text-brand-bronze" />
                    <span>Your Order History</span>
                  </h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 text-sm">
                      <p>No orders placed yet.</p>
                      <p className="text-xs text-gray-300 mt-1">Once you order snacks, your histories will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-brand-cream/40 rounded-2xl overflow-hidden hover:border-brand-cream transition-colors duration-200"
                        >
                          {/* Order Header */}
                          <div className="bg-brand-creamlight/40 px-5 py-4 border-b border-brand-cream/40 flex flex-wrap items-center justify-between gap-4 text-xs">
                            <div>
                              <span className="text-gray-400 font-medium">Order ID:</span>{' '}
                              <span className="font-extrabold text-brand-dark">#{order.id}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-medium">Placed on:</span>{' '}
                              <span className="font-semibold text-brand-dark">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 font-medium">Total Amount:</span>{' '}
                              <span className="font-black text-brand-dark text-sm">
                                ₹{parseFloat(order.totalAmount).toFixed(2)}
                              </span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </div>

                          {/* Order Items list */}
                          <div className="p-5 space-y-3.5 bg-white">
                            {order.orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center text-xs">
                                <div>
                                  <span className="font-bold text-brand-dark">{item.product.productName}</span>{' '}
                                  <span className="text-gray-400">({item.weight})</span>
                                  <span className="text-gray-400 ml-2">x{item.quantity}</span>
                                </div>
                                <span className="font-bold text-brand-dark">
                                  ₹{parseFloat(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
