import axios from 'axios';

// Get API base URL from env or default to localhost:8080
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INITIALIZE MOCK DATABASE IN LOCALSTORAGE
const INITIAL_PRODUCTS = [
  {
    id: 1,
    productName: 'Murukulu',
    description: 'Crispy and crunchy traditional South Indian snack made with rice flour, urad dal flour, and flavored with ajwain (carom seeds) and sesame seeds. Deep-fried in fresh oil for a homemade taste.',
    imageUrl: '/assets/images/murukulu.png',
    category: 'Savory',
    type: 'Snack',
    weights: [
      { id: 101, weight: '250 Grams', price: 120.00 },
      { id: 102, weight: '500 Grams', price: 230.00 },
      { id: 103, weight: '1000 Grams', price: 450.00 }
    ]
  },
  {
    id: 2,
    productName: 'Chekkalu',
    description: 'Traditional Andhra Rice Crackers made with rice flour, chana dal, ginger-green chili paste, and fresh curry leaves. These flat, golden disks offer a delicious crunch.',
    imageUrl: '/assets/images/chekkalu.png',
    category: 'Savory',
    type: 'Snack',
    weights: [
      { id: 201, weight: '250 Grams', price: 130.00 },
      { id: 202, weight: '500 Grams', price: 250.00 },
      { id: 203, weight: '1000 Grams', price: 480.00 }
    ]
  },
  {
    id: 3,
    productName: 'Karam Boondi',
    description: 'Spicy and savory snack made from tiny fried gram flour balls (boondi) mixed with roasted peanuts, cashews, garlic, curry leaves, and a perfect blend of spices.',
    imageUrl: '/assets/images/karam_boondi.png',
    category: 'Savory',
    type: 'Snack',
    weights: [
      { id: 301, weight: '250 Grams', price: 110.00 },
      { id: 302, weight: '500 Grams', price: 210.00 },
      { id: 303, weight: '1000 Grams', price: 400.00 }
    ]
  },
  {
    id: 4,
    productName: 'Mixture',
    description: 'A classic Indian snack containing a rich medley of sev, karam boondi, roasted peanuts, cashews, curry leaves, and traditional spices. The ultimate tea-time snack.',
    imageUrl: '/assets/images/mixture.png',
    category: 'Savory',
    type: 'Snack',
    weights: [
      { id: 401, weight: '250 Grams', price: 120.00 },
      { id: 402, weight: '500 Grams', price: 230.00 },
      { id: 403, weight: '1000 Grams', price: 450.00 }
    ]
  },
  {
    id: 5,
    productName: 'Janthikalu',
    description: 'A popular Andhra snack made from gram flour (besan) and rice flour, pressed into intricate patterns and deep-fried. Infused with carom seeds (vaamu) for a unique aroma.',
    imageUrl: '/assets/images/janthikalu.png',
    category: 'Savory',
    type: 'Snack',
    weights: [
      { id: 501, weight: '250 Grams', price: 120.00 },
      { id: 502, weight: '500 Grams', price: 230.00 },
      { id: 503, weight: '1000 Grams', price: 450.00 }
    ]
  },
  {
    id: 6,
    productName: 'Jeedi Pappu Pakodi',
    description: 'A premium, rich snack prepared with whole cashew nuts (jeedi pappu) coated in a spiced gram flour batter and deep-fried to perfection. Crunchy and cashew-rich.',
    imageUrl: '/assets/images/jeedi_pappu.png',
    category: 'Premium',
    type: 'Snack',
    weights: [
      { id: 601, weight: '250 Grams', price: 280.00 },
      { id: 602, weight: '500 Grams', price: 540.00 },
      { id: 603, weight: '1000 Grams', price: 1050.00 }
    ]
  },
  {
    id: 7,
    productName: 'Tomato Pickle',
    description: 'Authentic Andhra Tomato Pickle. Ripe red tomatoes slow-cooked and pickled with traditional mustard powder, fenugreek powder, and cold-pressed oil.',
    imageUrl: '/assets/images/tomato_pickle.png',
    category: 'Veg Pickle',
    type: 'Pickle',
    pickleType: 'Veg',
    pickleColor: 'Red',
    weights: [
      { id: 701, weight: '250 Grams', price: 150.00 },
      { id: 702, weight: '500 Grams', price: 280.00 },
      { id: 703, weight: '1000 Grams', price: 540.00 }
    ]
  },
  {
    id: 8,
    productName: 'Mango Pickle (Avakaya)',
    description: 'Traditional Telugu Avakaya mango pickle. Spicy mango chunks coated in a rich, flavorful red chili, mustard, and fenugreek masala.',
    imageUrl: '/assets/images/mango_pickle.png',
    category: 'Veg Pickle',
    type: 'Pickle',
    pickleType: 'Veg',
    pickleColor: 'Red',
    weights: [
      { id: 801, weight: '250 Grams', price: 160.00 },
      { id: 802, weight: '500 Grams', price: 300.00 },
      { id: 803, weight: '1000 Grams', price: 580.00 }
    ]
  },
  {
    id: 9,
    productName: 'Gongura Pickle',
    description: 'Authentic sorrel leaves pickle (Gongura Pachadi). Tangy green sorrel leaves fried and seasoned with red chilies, garlic cloves, and hot oil.',
    imageUrl: '/assets/images/gongura_pickle.png',
    category: 'Veg Pickle',
    type: 'Pickle',
    pickleType: 'Veg',
    pickleColor: 'Green',
    weights: [
      { id: 901, weight: '250 Grams', price: 140.00 },
      { id: 902, weight: '500 Grams', price: 260.00 },
      { id: 903, weight: '1000 Grams', price: 500.00 }
    ]
  },
  {
    id: 10,
    productName: 'Chicken Pickle',
    description: 'Ultra-flavorful Andhra Chicken Pickle. Succulent chicken pieces fried to perfection and preserved in ginger-garlic paste and spices.',
    imageUrl: '/assets/images/chicken_pickle.png',
    category: 'Non-Veg Pickle',
    type: 'Pickle',
    pickleType: 'Non-Veg',
    pickleColor: 'Red',
    weights: [
      { id: 1001, weight: '250 Grams', price: 350.00 },
      { id: 1002, weight: '500 Grams', price: 680.00 },
      { id: 1003, weight: '1000 Grams', price: 1300.00 }
    ]
  },
  {
    id: 11,
    productName: 'Mutton Pickle',
    description: 'Premium Andhra Mutton Pickle. Tender mutton chunks seasoned and slow-cooked in traditional pickle spices and rich sesame oil.',
    imageUrl: '/assets/images/mutton_pickle.png',
    category: 'Non-Veg Pickle',
    type: 'Pickle',
    pickleType: 'Non-Veg',
    pickleColor: 'Red',
    weights: [
      { id: 1101, weight: '250 Grams', price: 450.00 },
      { id: 1102, weight: '500 Grams', price: 850.00 },
      { id: 1103, weight: '1000 Grams', price: 1650.00 }
    ]
  },
  {
    id: 12,
    productName: 'Prawns Pickle',
    description: 'Authentic coastal prawns pickle. Juicy prawns marinated in traditional spices, fried crisp, and pickled in a fiery Andhra gravy.',
    imageUrl: '/assets/images/prawns_pickle.png',
    category: 'Non-Veg Pickle',
    type: 'Pickle',
    pickleType: 'Non-Veg',
    pickleColor: 'Red',
    weights: [
      { id: 1201, weight: '250 Grams', price: 400.00 },
      { id: 1202, weight: '500 Grams', price: 780.00 },
      { id: 1203, weight: '1000 Grams', price: 1500.00 }
    ]
  }
];

const INITIAL_USERS = [
  { id: 1, fullName: 'Amigos Admin', email: 'admin@amigossnacks.com', password: 'admin123', mobileNumber: '8341462856', role: 'ADMIN', createdAt: new Date().toISOString() },
  { id: 2, fullName: 'Sai Kumar', email: 'customer@amigossnacks.com', password: 'customer123', mobileNumber: '9876543210', role: 'USER', createdAt: new Date().toISOString() },
  { id: 3, fullName: 'Akash Nambula', email: 'akashnambula@gamil.com', password: 'akash123', mobileNumber: '8341462856', role: 'ADMIN', createdAt: new Date().toISOString() }
];

const initMockDb = () => {
  const cachedProducts = localStorage.getItem('mock_products');
  if (!cachedProducts || !cachedProducts.includes('Tomato Pickle')) {
    localStorage.setItem('mock_products', JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem('mock_users')) {
    localStorage.setItem('mock_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('mock_orders')) {
    localStorage.setItem('mock_orders', JSON.stringify([]));
  }
  if (!localStorage.getItem('mock_address')) {
    localStorage.setItem('mock_address', JSON.stringify({}));
  }
  if (!localStorage.getItem('mock_cart')) {
    localStorage.setItem('mock_cart', JSON.stringify([]));
  }
};

// HANDLER FOR CLIENT-SIDE MOCK REQUESTS
const handleMockRequest = (config) => {
  initMockDb();
  
  const url = config.url;
  const method = config.method.toUpperCase();
  
  let data = null;
  if (config.data) {
    if (config.data instanceof FormData) {
      data = config.data;
    } else {
      try {
        data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
      } catch (e) {
        data = config.data;
      }
    }
  }
  
  const params = config.params || {};

  console.warn(`[Mock Database API Fallback] ${method} request to URL: ${url}`);

  const mockProducts = JSON.parse(localStorage.getItem('mock_products'));
  const mockUsers = JSON.parse(localStorage.getItem('mock_users'));
  const mockOrders = JSON.parse(localStorage.getItem('mock_orders'));
  const mockAddress = JSON.parse(localStorage.getItem('mock_address'));

  // Helper mock response
  const resolve = (status, responseData) => {
    return {
      data: responseData,
      status: status,
      statusText: 'OK',
      headers: {},
      config: config,
      request: {}
    };
  };

  const reject = (status, errorMessage) => {
    const err = new Error(errorMessage);
    err.response = {
      status: status,
      data: { message: errorMessage }
    };
    return Promise.reject(err);
  };

  // --- Endpoints routing ---

  // 0. IMAGE UPLOAD FALLBACK
  if (url === '/api/upload' && method === 'POST') {
    let file = null;
    if (data instanceof FormData) {
      file = data.get('file');
    }
    if (file) {
      try {
        const localUrl = URL.createObjectURL(file);
        return resolve(200, { imageUrl: localUrl });
      } catch (e) {
        console.error('Failed to create mock local URL', e);
      }
    }
    return resolve(200, { imageUrl: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=600&auto=format&fit=crop' });
  }

  // 1. AUTH LOGIN
  if (url === '/api/auth/login' && method === 'POST') {
    const matched = mockUsers.find(u => u.email === data.email);
    const isPasswordCorrect = matched && (
      (matched.password && matched.password === data.password) ||
      (!matched.password && (data.password === 'admin123' || data.password === 'customer123' || data.password === 'akash123'))
    );

    if (matched && isPasswordCorrect) {
      const mockToken = `mock-jwt-token-for-${matched.id}`;
      localStorage.setItem('mock_logged_in_user', JSON.stringify(matched));
      return resolve(200, {
        accessToken: mockToken,
        tokenType: 'Bearer',
        id: matched.id,
        fullName: matched.fullName,
        email: matched.email,
        role: matched.role
      });
    }
    return reject(401, 'Invalid email or password');
  }

  // 2. AUTH REGISTER
  if (url === '/api/auth/register' && method === 'POST') {
    if (mockUsers.some(u => u.email === data.email)) {
      return reject(409, 'Email address already in use!');
    }
    const newUser = {
      id: Date.now(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      mobileNumber: data.mobileNumber,
      role: 'USER',
      createdAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(mockUsers));
    return resolve(201, { success: true, message: 'User registered successfully' });
  }

  // 3. AUTH CURRENT USER (me)
  if (url === '/api/auth/me' && method === 'GET') {
    const sessionUser = JSON.parse(localStorage.getItem('mock_logged_in_user'));
    if (!sessionUser) {
      return reject(401, 'Unauthorized');
    }
    return resolve(200, sessionUser);
  }

  // 4. GET ALL PRODUCTS
  if (url.startsWith('/api/products') && method === 'GET') {
    const parts = url.split('/');
    // Check if GET /api/products/{id}
    if (parts.length === 4 && parts[3]) {
      const id = parseInt(parts[3]);
      const matched = mockProducts.find(p => p.id === id);
      if (matched) return resolve(200, matched);
      return reject(404, 'Product not found');
    }
    
    // Return all (supporting filters)
    return resolve(200, mockProducts);
  }

  // 5. USER ADDRESS
  if (url === '/api/orders/address' && method === 'GET') {
    return resolve(200, mockAddress);
  }
  if (url === '/api/orders/address' && method === 'POST') {
    localStorage.setItem('mock_address', JSON.stringify(data));
    return resolve(200, data);
  }

  // 6. ORDER CHECKOUT / PLACE ORDER
  if (url === '/api/orders/checkout' && method === 'POST') {
    const sessionUser = JSON.parse(localStorage.getItem('mock_logged_in_user'));
    if (!sessionUser) return reject(401, 'Unauthorized');

    // Get current cart details from mock_cart
    const mockCart = JSON.parse(localStorage.getItem('mock_cart')) || [];
    const userCart = mockCart.filter(item => item.userId === sessionUser.id);
    
    if (userCart.length === 0) return reject(400, 'Cannot checkout with empty cart');

    // Calculate totals
    let totalAmount = 0;
    const orderItems = userCart.map(item => {
      const matchedProd = mockProducts.find(p => p.id === item.product.id);
      const matchedWeight = matchedProd.weights.find(w => w.weight === item.weight);
      const price = matchedWeight ? matchedWeight.price : 0;
      totalAmount += (price * item.quantity);

      return {
        id: Date.now() + Math.random(),
        product: matchedProd,
        weight: item.weight,
        quantity: item.quantity,
        price: price
      };
    });

    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000), // Mock 4 digit ID
      user: sessionUser,
      totalAmount: totalAmount,
      orderStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      orderItems: orderItems
    };

    mockOrders.push(newOrder);
    localStorage.setItem('mock_orders', JSON.stringify(mockOrders));

    // Clear user cart
    const remainingCart = mockCart.filter(item => item.userId !== sessionUser.id);
    localStorage.setItem('mock_cart', JSON.stringify(remainingCart));

    return resolve(200, newOrder);
  }

  // 7. GET USER ORDERS HISTORY
  if (url === '/api/orders' && method === 'GET') {
    const sessionUser = JSON.parse(localStorage.getItem('mock_logged_in_user'));
    if (!sessionUser) return reject(401, 'Unauthorized');

    const userOrders = mockOrders.filter(o => o.user.id === sessionUser.id);
    return resolve(200, userOrders);
  }

  // 8. ADMIN STATISTICS
  if (url === '/api/admin/stats' && method === 'GET') {
    const totalRev = mockOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return resolve(200, {
      totalUsers: mockUsers.length,
      totalOrders: mockOrders.length,
      totalProducts: mockProducts.length,
      totalRevenue: totalRev
    });
  }

  // 9. ADMIN USERS
  if (url.startsWith('/api/admin/users') && method === 'GET') {
    return resolve(200, mockUsers);
  }
  if (url.startsWith('/api/admin/users/') && method === 'DELETE') {
    const id = parseInt(url.split('/').pop());
    const filtered = mockUsers.filter(u => u.id !== id);
    localStorage.setItem('mock_users', JSON.stringify(filtered));
    return resolve(200, { message: 'User deleted' });
  }

  // 10. ADMIN PRODUCTS CRUD
  if (url === '/api/admin/products' && method === 'POST') {
    const newProd = {
      id: Date.now(),
      productName: data.productName,
      description: data.description,
      imageUrl: data.imageUrl,
      category: data.category,
      weights: data.weights.map((w, idx) => ({ id: Date.now() + idx, ...w }))
    };
    mockProducts.push(newProd);
    localStorage.setItem('mock_products', JSON.stringify(mockProducts));
    return resolve(200, newProd);
  }

  if (url.startsWith('/api/admin/products/') && method === 'PUT') {
    const id = parseInt(url.split('/').pop());
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx > -1) {
      mockProducts[idx] = {
        id: id,
        productName: data.productName,
        description: data.description,
        imageUrl: data.imageUrl,
        category: data.category,
        weights: data.weights.map((w, wIdx) => ({ id: id * 10 + wIdx, ...w }))
      };
      localStorage.setItem('mock_products', JSON.stringify(mockProducts));
      return resolve(200, mockProducts[idx]);
    }
    return reject(404, 'Product not found');
  }

  if (url.startsWith('/api/admin/products/') && method === 'DELETE') {
    const id = parseInt(url.split('/').pop());
    const filtered = mockProducts.filter(p => p.id !== id);
    localStorage.setItem('mock_products', JSON.stringify(filtered));
    return resolve(200, { message: 'Product deleted' });
  }

  // 11. ADMIN ORDERS LIST & UPDATE STATUS
  if (url.startsWith('/api/admin/orders') && method === 'GET') {
    return resolve(200, mockOrders);
  }
  if (url.startsWith('/api/admin/orders/') && url.endsWith('/status') && method === 'PUT') {
    const orderId = parseInt(url.split('/')[4]);
    const idx = mockOrders.findIndex(o => o.id === orderId);
    if (idx > -1) {
      mockOrders[idx].orderStatus = data.status.toUpperCase();
      localStorage.setItem('mock_orders', JSON.stringify(mockOrders));
      return resolve(200, mockOrders[idx]);
    }
    return reject(404, 'Order not found');
  }

  // Mock Cart Endpoints
  if (url.startsWith('/api/cart') && !url.endsWith('/clear')) {
    const sessionUser = JSON.parse(localStorage.getItem('mock_logged_in_user'));
    if (!sessionUser) return reject(401, 'Unauthorized');

    const mockCart = JSON.parse(localStorage.getItem('mock_cart')) || [];

    if (method === 'GET') {
      const userCart = mockCart.filter(item => item.userId === sessionUser.id);
      return resolve(200, userCart);
    }

    if (method === 'POST') {
      const matchedProd = mockProducts.find(p => p.id === data.productId);
      if (!matchedProd) return reject(404, 'Product not found');

      const existingIndex = mockCart.findIndex(
        item => item.userId === sessionUser.id && item.product.id === data.productId && item.weight === data.weight
      );

      if (existingIndex > -1) {
        mockCart[existingIndex].quantity += data.quantity;
      } else {
        mockCart.push({
          id: Date.now() + Math.random(),
          userId: sessionUser.id,
          product: matchedProd,
          weight: data.weight,
          quantity: data.quantity
        });
      }

      localStorage.setItem('mock_cart', JSON.stringify(mockCart));
      return resolve(200, {});
    }

    // Check for ID operations: PUT /api/cart/{id} or DELETE /api/cart/{id}
    const parts = url.split('/');
    if (parts.length === 4 && parts[3]) {
      const cartItemId = parseFloat(parts[3].split('?')[0]);
      const idx = mockCart.findIndex(item => item.id === cartItemId);

      if (idx > -1) {
        if (method === 'PUT') {
          const qtyParam = params.quantity || (url.includes('quantity=') ? parseInt(url.split('quantity=').pop()) : 1);
          if (qtyParam <= 0) {
            mockCart.splice(idx, 1);
          } else {
            mockCart[idx].quantity = qtyParam;
          }
          localStorage.setItem('mock_cart', JSON.stringify(mockCart));
          return resolve(200, {});
        }

        if (method === 'DELETE') {
          mockCart.splice(idx, 1);
          localStorage.setItem('mock_cart', JSON.stringify(mockCart));
          return resolve(200, { message: 'Item removed' });
        }
      }
      return reject(404, 'Cart item not found');
    }
  }

  if (url === '/api/cart/clear' && method === 'DELETE') {
    const sessionUser = JSON.parse(localStorage.getItem('mock_logged_in_user'));
    if (!sessionUser) return reject(401, 'Unauthorized');

    const mockCart = JSON.parse(localStorage.getItem('mock_cart')) || [];
    const filtered = mockCart.filter(item => item.userId !== sessionUser.id);
    localStorage.setItem('mock_cart', JSON.stringify(filtered));
    return resolve(200, {});
  }

  return reject(404, 'API Endpoint not found in mock database.');
};

// Response interceptor to handle token expiry AND fallback to Mock DB on network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if backend connection failed
    const isNetworkError = error.message === 'Network Error' || error.code === 'ERR_NETWORK' || !error.response;
    
    if (isNetworkError) {
      try {
        // Run mock fallback controller
        return handleMockRequest(error.config);
      } catch (mockErr) {
        console.error('[Mock Database Fatal Error]', mockErr);
        return Promise.reject(mockErr);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('mock_logged_in_user');
    }
    return Promise.reject(error);
  }
);

export default api;
