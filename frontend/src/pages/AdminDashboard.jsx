import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  Users, ShoppingCart, Package, DollarSign, Edit, Trash2, Plus, 
  Search, RefreshCw, X, ChevronRight, Clipboard, UserCheck, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalProducts: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  // Data lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Search states
  const [orderQuery, setOrderQuery] = useState('');
  const [userQuery, setUserQuery] = useState('');

  // Modal / Form state for Product creation/edit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [prodForm, setProdForm] = useState({
    productName: '',
    description: '',
    imageUrl: '',
    category: 'Savory',
    price250: '',
    price500: '',
    price1000: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Custom Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Dual Image Upload Source Mode
  const [imageSourceMode, setImageSourceMode] = useState('url'); // 'url' or 'upload'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isImageUrlValid, setIsImageUrlValid] = useState(true);

  const loadStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products', err);
    }
  };

  const loadOrders = async (query = '') => {
    try {
      const response = await api.get(`/api/admin/orders?search=${query}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders', err);
    }
  };

  const loadUsers = async (query = '') => {
    try {
      const response = await api.get(`/api/admin/users?search=${query}`);
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadProducts(), loadOrders(), loadUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handle order status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      loadOrders(orderQuery);
      loadStats(); // refresh revenue if needed
    } catch (err) {
      console.error('Failed to update order status', err);
      toast.error('Failed to update order status');
    }
  };

  const executeDeleteUser = async (userId) => {
    try {
      await api.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted successfully');
      loadUsers(userQuery);
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Customer Account',
      message: 'Are you sure you want to delete this customer account? This action cannot be undone.',
      onConfirm: () => executeDeleteUser(userId)
    });
  };

  // Open modal for Product adding
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setImageSourceMode('url');
    setIsImageUrlValid(true);
    setProdForm({
      productName: '',
      description: '',
      imageUrl: '',
      category: 'Savory',
      price250: '120.00',
      price500: '230.00',
      price1000: '450.00'
    });
    setFormError('');
    setFormSuccess('');
    setShowProductModal(true);
  };

  // Open modal for Product editing
  const handleOpenEditModal = (product) => {
    setEditingProductId(product.id);
    
    // Auto-detect image source mode
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      setImageSourceMode('upload');
    } else {
      setImageSourceMode('url');
    }
    setIsImageUrlValid(true);
    
    // Find prices
    const p250 = product.weights.find(w => w.weight === '250 Grams')?.price || '0';
    const p500 = product.weights.find(w => w.weight === '500 Grams')?.price || '0';
    const p1000 = product.weights.find(w => w.weight === '1000 Grams')?.price || '0';

    setProdForm({
      productName: product.productName,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      price250: p250,
      price500: p500,
      price1000: p1000
    });
    setFormError('');
    setFormSuccess('');
    setShowProductModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, JPEG, and WEBP formats are allowed.');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProdForm(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
      setIsImageUrlValid(true);
      toast.success('Image uploaded successfully.');
    } catch (err) {
      console.error('Upload failed', err);
      toast.error(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit product Form (create or edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { productName, description, imageUrl, category, price250, price500, price1000 } = prodForm;

    if (!productName || !description || !price250 || !price500 || !price1000) {
      toast.error('Please fill in all required fields.');
      setFormError('Please fill in all fields.');
      return;
    }

    if (!imageUrl) {
      toast.error('Please provide an image URL or upload an image.');
      setFormError('Please provide an image URL or upload an image.');
      return;
    }

    if (!isImageUrlValid) {
      toast.error('Please provide a valid image URL.');
      setFormError('Please provide a valid image URL.');
      return;
    }

    const payload = {
      productName,
      description,
      imageUrl,
      category,
      weights: [
        { weight: '250 Grams', price: parseFloat(price250) },
        { weight: '500 Grams', price: parseFloat(price500) },
        { weight: '1000 Grams', price: parseFloat(price1000) }
      ]
    };

    try {
      if (editingProductId) {
        // Edit Mode
        await api.put(`/api/admin/products/${editingProductId}`, payload);
        toast.success('Product updated successfully');
        setFormSuccess('Snack product modified successfully!');
      } else {
        // Add Mode
        await api.post('/api/admin/products', payload);
        toast.success('Product added successfully');
        setFormSuccess('New snack product added successfully!');
      }

      await loadProducts();
      await loadStats();

      setTimeout(() => {
        setShowProductModal(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to save product', err);
      toast.error(err.response?.data?.message || 'Could not save snack product.');
      setFormError(err.response?.data?.message || 'Could not save snack product.');
    }
  };

  const executeDeleteProduct = async (productId) => {
    try {
      await api.delete(`/api/admin/products/${productId}`);
      toast.success('Product deleted successfully');
      loadProducts();
      loadStats();
    } catch (err) {
      console.error('Failed to delete product', err);
      toast.error('Failed to delete product');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Snack Product',
      message: 'Are you sure you want to delete this snack product? This will clear all weight configurations.',
      onConfirm: () => executeDeleteProduct(productId)
    });
  };

  // Handle Search input submits
  const handleOrderSearch = (e) => {
    e.preventDefault();
    loadOrders(orderQuery);
  };

  const handleUserSearch = (e) => {
    e.preventDefault();
    loadUsers(userQuery);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-creamlight">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-bronze"></div>
      </div>
    );
  }

  return (
    <div className="bg-brand-creamlight min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Panel */}
      <div className="w-full md:w-64 bg-brand-dark text-brand-cream border-r border-brand-darker flex flex-col pt-6 shrink-0">
        <div className="px-6 mb-8 text-center md:text-left">
          <h2 className="text-xl font-black text-brand-cream">Admin Panel</h2>
          <p className="text-[10px] text-brand-light font-semibold uppercase mt-0.5">Amigos Snacks Management</p>
        </div>
        
        <nav className="flex-grow space-y-1.5 px-3 pb-8">
          <button
            onClick={() => setActiveTab('stats')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'stats' ? 'bg-brand-bronze text-white shadow-sm' : 'hover:bg-brand-darker'
            }`}
          >
            <DollarSign className="h-5 w-5" />
            <span>Dashboard Stats</span>
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'products' ? 'bg-brand-bronze text-white shadow-sm' : 'hover:bg-brand-darker'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Products Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'orders' ? 'bg-brand-bronze text-white shadow-sm' : 'hover:bg-brand-darker'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Orders Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              activeTab === 'users' ? 'bg-brand-bronze text-white shadow-sm' : 'hover:bg-brand-darker'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Customers List</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        
        {/* TAB 1: DASHBOARD STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-black text-brand-dark">Statistics Dashboard</h1>
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-brand-cream/35 shadow-sm flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
                  <h3 className="text-2xl font-extrabold text-brand-dark mt-1">{stats.totalUsers}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-brand-cream/35 shadow-sm flex items-center space-x-4">
                <div className="bg-amber-100 p-4 rounded-xl text-amber-600"><ShoppingCart className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-2xl font-extrabold text-brand-dark mt-1">{stats.totalOrders}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-brand-cream/35 shadow-sm flex items-center space-x-4">
                <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><Package className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Products</p>
                  <h3 className="text-2xl font-extrabold text-brand-dark mt-1">{stats.totalProducts}</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-brand-cream/35 shadow-sm flex items-center space-x-4">
                <div className="bg-green-100 p-4 rounded-xl text-green-600"><DollarSign className="h-6 w-6" /></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                  <h3 className="text-2xl font-extrabold text-brand-dark mt-1">₹{parseFloat(stats.totalRevenue).toFixed(2)}</h3>
                </div>
              </div>

            </div>

            <div className="bg-white rounded-3xl p-6 border border-brand-cream/30 shadow-sm">
              <h3 className="font-bold text-brand-dark text-base mb-4 border-b border-brand-cream/20 pb-2">Admin Actions Guide</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Use the side navigation links to access inventory product controls, check orders list, change shipping logs, and manage customers.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-black text-brand-dark">Products Catalogue Management</h1>
              <button
                onClick={handleOpenAddModal}
                className="bg-brand-bronze hover:bg-brand-light text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-1.5 self-start sm:self-auto shadow-sm"
              >
                <Plus className="h-4.5 w-4.5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-brand-cream/30 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-creamlight/50 border-b border-brand-cream/30 text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="p-5">Product Name</th>
                    <th className="p-5">Category</th>
                    <th className="p-5">Weights & Prices</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/25">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-brand-creamlight/10 text-brand-dark">
                      <td className="p-5">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={prod.imageUrl}
                            alt={prod.productName}
                            className="w-12 h-12 rounded-xl object-cover bg-brand-cream/15 shrink-0 border border-brand-cream/25"
                          />
                          <div>
                            <span className="font-extrabold text-sm block">{prod.productName}</span>
                            <span className="text-[10px] text-gray-400 line-clamp-1 max-w-[200px] mt-0.5">{prod.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="bg-brand-cream/60 text-brand-bronze text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1 text-[11px] font-semibold text-gray-500">
                          {prod.weights.map((w) => (
                            <div key={w.id}>
                              {w.weight}: <span className="text-brand-dark font-extrabold">₹{parseFloat(w.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          className="text-brand-light hover:text-brand-dark hover:bg-brand-cream/30 p-2 rounded-lg transition-colors border border-brand-cream/20"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors border border-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-brand-dark">Order Logs Manager</h1>

            {/* Search orders */}
            <form onSubmit={handleOrderSearch} className="flex max-w-md space-x-3 mb-4">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search by ID or customer name..."
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze/20"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-dark hover:bg-brand-darker text-brand-cream px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-brand-cream/30 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-creamlight/50 border-b border-brand-cream/30 text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="p-5">Order ID</th>
                    <th className="p-5">Customer Details</th>
                    <th className="p-5">Items</th>
                    <th className="p-5">Total</th>
                    <th className="p-5">Status Options</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/25">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-brand-creamlight/10 text-brand-dark">
                      <td className="p-5 font-bold text-gray-400">#{ord.id}</td>
                      <td className="p-5 leading-normal">
                        <span className="font-extrabold block text-sm">{ord.user.fullName}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{ord.user.email}</span>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1 text-[11px] text-gray-500 max-w-[200px] leading-snug">
                          {ord.orderItems.map((item) => (
                            <div key={item.id}>
                              • {item.product.productName} ({item.weight}) x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-5 font-extrabold text-sm">₹{parseFloat(ord.totalAmount).toFixed(2)}</td>
                      <td className="p-5">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                          className="bg-brand-creamlight border border-gray-200 font-extrabold text-[10px] uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-bronze cursor-pointer"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USERS LIST */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-brand-dark">Customers Directory</h1>

            {/* Search users */}
            <form onSubmit={handleUserSearch} className="flex max-w-md space-x-3 mb-4">
              <div className="relative flex-grow">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze/20"
                />
              </div>
              <button
                type="submit"
                className="bg-brand-dark hover:bg-brand-darker text-brand-cream px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            <div className="bg-white rounded-3xl border border-brand-cream/30 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-brand-creamlight/50 border-b border-brand-cream/30 text-gray-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="p-5">Full Name</th>
                    <th className="p-5">Email Address</th>
                    <th className="p-5">WhatsApp Phone</th>
                    <th className="p-5">Registered Date</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-cream/25">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-brand-creamlight/10 text-brand-dark">
                      <td className="p-5">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4.5 w-4.5 text-brand-bronze shrink-0" />
                          <span className="font-extrabold text-sm">{u.fullName}</span>
                          {u.role === 'ADMIN' && (
                            <span className="bg-brand-dark text-brand-cream text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                              ADMIN
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-medium text-gray-500">{u.email}</td>
                      <td className="p-5 font-semibold text-brand-dark">+91 {u.mobileNumber}</td>
                      <td className="p-5 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        {u.role !== 'ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors border border-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* PRODUCT CREATION/EDIT MODAL OVERLAY */}
      {showProductModal && (
        <div className="fixed inset-0 bg-brand-darker/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-brand-cream shadow-2xl relative space-y-6">
            
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-creamlight text-gray-400 hover:text-brand-dark transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="border-b border-brand-cream/20 pb-4">
              <h2 className="text-xl font-black text-brand-dark">
                {editingProductId ? 'Modify Snack Details' : 'Add New Snack Delicacy'}
              </h2>
              <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">Store Inventory Configuration</p>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs font-semibold">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-3.5 rounded-xl text-xs font-semibold">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={prodForm.productName}
                    onChange={(e) => setProdForm({ ...prodForm, productName: e.target.value })}
                    placeholder="e.g. Karam Boondi"
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-bronze"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-bronze cursor-pointer font-bold"
                  >
                    <option value="Savory">Savory</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                  Product Image *
                </label>
                <div className="flex bg-brand-creamlight/30 border border-brand-cream/40 p-1 rounded-xl mb-3.5 max-w-[240px]">
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('url')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                      imageSourceMode === 'url'
                        ? 'bg-brand-dark text-brand-cream shadow-sm'
                        : 'text-brand-dark hover:text-brand-bronze'
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('upload')}
                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-200 cursor-pointer ${
                      imageSourceMode === 'upload'
                        ? 'bg-brand-dark text-brand-cream shadow-sm'
                        : 'text-brand-dark hover:text-brand-bronze'
                    }`}
                  >
                    Upload Image
                  </button>
                </div>

                {imageSourceMode === 'url' ? (
                  <input
                    type="url"
                    value={prodForm.imageUrl}
                    onChange={(e) => {
                      setProdForm({ ...prodForm, imageUrl: e.target.value });
                      setIsImageUrlValid(true);
                    }}
                    placeholder="Pasted direct image URL (e.g. https://...)"
                    className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-bronze"
                  />
                ) : (
                  <div className="flex items-center space-x-3 bg-brand-creamlight/20 border border-brand-cream/15 p-4 rounded-xl">
                    <button
                      type="button"
                      onClick={() => document.getElementById('file-picker-input').click()}
                      disabled={uploadingImage}
                      className="px-4 py-2.5 bg-brand-cream text-brand-dark hover:bg-brand-dark hover:text-brand-cream border border-brand-light/20 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Upload className="h-4 w-4 text-brand-bronze" />
                      <span>{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                    </button>
                    <span className="text-[10px] text-gray-400">Supports PNG, JPG, JPEG, WEBP</span>
                    <input
                      type="file"
                      id="file-picker-input"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Image Preview Block */}
                {prodForm.imageUrl && (
                  <div className="mt-4 bg-brand-creamlight/10 border border-brand-cream/20 p-3 rounded-2xl">
                    <span className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">Image Preview</span>
                    <div className="relative aspect-video max-w-xs rounded-xl overflow-hidden bg-brand-creamlight/45 border border-brand-cream/35 flex items-center justify-center">
                      <img
                        src={prodForm.imageUrl}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                        onLoad={() => setIsImageUrlValid(true)}
                        onError={() => setIsImageUrlValid(false)}
                      />
                      {!isImageUrlValid && (
                        <div className="absolute inset-0 bg-red-50/95 flex flex-col items-center justify-center p-3 text-center border border-red-200 rounded-xl">
                          <span className="text-[10px] text-red-600 font-extrabold uppercase tracking-wider">Invalid image URL</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">
                  Product Description *
                </label>
                <textarea
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Explain traditional Andhra preparations, spices, ingredients..."
                  rows={3}
                  className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-brand-dark focus:outline-none focus:border-brand-bronze resize-none"
                  required
                />
              </div>

              {/* Weight Prices Grid */}
              <div className="bg-brand-creamlight/40 border border-brand-cream/35 p-5 rounded-2xl space-y-3.5">
                <span className="block text-[10px] font-extrabold text-brand-bronze uppercase tracking-wider border-b border-brand-cream/35 pb-1">
                  Weights Pricing Setup (₹)
                </span>
                
                <div className="grid grid-cols-3 gap-4 text-[10px] text-gray-400 uppercase font-extrabold tracking-wider">
                  <div>
                    <label className="block mb-1.5">250 Grams Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodForm.price250}
                      onChange={(e) => setProdForm({ ...prodForm, price250: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark font-extrabold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">500 Grams Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodForm.price500}
                      onChange={(e) => setProdForm({ ...prodForm, price500: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark font-extrabold focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5">1000 Grams Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodForm.price1000}
                      onChange={(e) => setProdForm({ ...prodForm, price1000: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-brand-dark font-extrabold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-brand-cream/20 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-full bg-brand-creamlight text-brand-dark py-3 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-brand-bronze hover:bg-brand-light text-white py-3 rounded-xl text-xs font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-brand-darker/60 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-brand-cream shadow-2xl relative space-y-4 text-center">
            <div className="flex justify-center text-brand-bronze mb-2">
              <span className="bg-brand-cream/40 p-4 rounded-full">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
            </div>
            <h3 className="text-lg font-bold text-brand-dark">{confirmModal.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{confirmModal.message}</p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="w-full bg-brand-creamlight text-brand-dark py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ ...confirmModal, isOpen: false });
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
