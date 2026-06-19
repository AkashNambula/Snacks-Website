# Amigos Snacks - Full-Stack E-Commerce Website

Amigos Snacks is a premium, production-ready full-stack e-commerce web application for selling traditional Andhra homemade snacks (Murukulu, Chekkalu, Karam Boondi, Mixture, Janthikalu, and Jeedi Pappu Pakodi).

This project features a secure **Spring Boot** backend using **Spring Security** and **JWT Authentication**, a responsive and animated **React.js** frontend styled with **Tailwind CSS v4** and **Framer Motion**, and a **MySQL** database.

---

## 📂 Project Folder Structure

```
amigos-snacks/
├── database/
│   ├── schema.sql              # MySQL database table definitions
│   └── data.sql                # Seed products, weights, and initial accounts
├── backend/
│   ├── pom.xml                 # Maven dependencies configurations
│   └── src/
│       └── main/
│           ├── java/com/amigossnacks/backend/
│           │   ├── config/
│           │   │   ├── SecurityConfig.java       # Security & CORS filters
│           │   │   └── DatabaseSeeder.java       # Auto-seeds users/products
│           │   ├── controller/
│           │   │   ├── AuthController.java       # Login & Registration endpoints
│           │   │   ├── ProductController.java    # Browsing & search endpoints
│           │   │   ├── CartController.java       # Shopping cart operations
│           │   │   ├── OrderController.java      # Order processing & user addresses
│           │   │   └── AdminController.java      # Statistics, products CRUD, order updates
│           │   ├── dto/                          # Request & Response payloads
│           │   ├── entity/                       # JPA database models
│           │   ├── repository/                   # Spring Data JPA repositories
│           │   ├── security/                     # JWT provider & auth filters
│           │   │   ├── JwtTokenProvider.java
│           │   │   ├── JwtAuthenticationFilter.java
│           │   │   └── UserPrincipal.java
│           │   └── service/                      # Core business services
│           │       ├── ProductService.java
│           │       ├── CartService.java
│           │       └── OrderService.java
│           └── resources/
│               └── application.properties        # Database & JWT configurations
└── frontend/
    ├── index.html              # HTML base with SEO meta tags
    ├── package.json            # React npm packages and build scripts
    ├── tailwind.config.js      # Tailwind configurations
    ├── postcss.config.js       # PostCSS plugins setup
    └── src/
        ├── App.jsx             # Main routing & state wrappers
        ├── main.jsx            # Vite DOM renderer
        ├── index.css           /* CSS variables & Tailwind v4 theme */
        ├── components/         # Reusable widgets (Navbar, Footer, ProductCard)
        ├── context/            # AuthContext (JWT) and CartContext (synchronization)
        ├── pages/              # Home, Catalog, Details, Cart, Checkout, Dashboards
        └── services/           # Axios HTTP client interface
```

---

## 🛠️ Setup Instructions

### 1. Database Setup (MySQL)
1. Log in to your MySQL server.
2. Run the `database/schema.sql` file to create the `amigos_snacks` database and tables:
   ```sql
   source database/schema.sql;
   ```
3. (Optional) Run the seed script:
   ```sql
   source database/data.sql;
   ```
   *Note: The backend has an integrated `DatabaseSeeder` which will automatically seed the initial snacks, weight configurations, and demo accounts on first run if the database is empty.*

### 2. Backend Setup (Spring Boot)
1. Open the `backend/src/main/resources/application.properties` file and verify the database configuration:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/amigos_snacks?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
2. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
3. Run the Spring Boot application (using Maven):
   ```bash
   mvn spring-boot:run
   ```
   The server will start on port `8080` (accessible at `http://localhost:8080`).

### 3. Frontend Setup (React + Vite + Tailwind CSS)
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🔐 Credentials for Demo Accounts
*   **Administrator Account:**
    *   **Email:** `admin@amigossnacks.com`
    *   **Password:** `admin123`
*   **Customer Account:**
    *   **Email:** `customer@amigossnacks.com`
    *   **Password:** `customer123`

---

## 📡 REST API Documentation

### Public Endpoints (Accessible to Guests)
*   `POST /api/auth/register` - Create a new user account.
*   `POST /api/auth/login` - Authenticate credentials, returns a JWT token.
*   `GET /api/products` - List snacks. Supports filtering by query parameters `category` or `search`.
*   `GET /api/products/{id}` - Get individual snack details and weight pricing options.

### Authenticated Customer Endpoints
*(Requires `Authorization: Bearer <JWT_TOKEN>`)*
*   `GET /api/auth/me` - Retrieve current session details and profile logs.
*   `GET /api/cart` - Retrieve shopping cart items.
*   `POST /api/cart` - Add item to cart. (Consolidates quantities if the snack & weight combination already exists).
*   `PUT /api/cart/{cartItemId}?quantity={n}` - Update item quantity in cart.
*   `DELETE /api/cart/{cartItemId}` - Remove item from cart.
*   `DELETE /api/cart/clear` - Clear user cart.
*   `GET /api/orders` - View user's past orders history.
*   `GET /api/orders/{id}` - View specific order summary.
*   `GET /api/orders/address` - Retrieve saved shipping address.
*   `POST /api/orders/address` - Update or create shipping address details.
*   `POST /api/orders/checkout` - Places order, clears user cart, and returns order summary details.

### Administrator Endpoints
*(Requires `Authorization: Bearer <JWT_TOKEN>` and user role `ADMIN`)*
*   `GET /api/admin/stats` - Retrieve dashboard analytics (Total users, orders, products, total revenue).
*   `GET /api/admin/users` - View all registered users (supports `search` parameter).
*   `DELETE /api/admin/users/{id}` - Delete user account (cannot delete other Admin accounts).
*   `POST /api/admin/products` - Add a new product with weight-price tiers.
*   `PUT /api/admin/products/{id}` - Modify existing product details and price points.
*   `DELETE /api/admin/products/{id}` - Delete product from catalogue.
*   `GET /api/admin/orders` - View all customer orders (supports `search` parameter).
*   `PUT /api/admin/orders/{id}/status` - Update order status (PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED).

---

## 📲 WhatsApp Order Integration

Upon successful order creation on the checkout page, the React client automatically compiles a URL-encoded string detailing the purchase summary. It immediately redirects the customer to:
`https://wa.me/918341462856?text={ORDER_DETAILS}`

### Format of the WhatsApp Message
```text
Hello Amigos Snacks,

Customer Name: Sai Kumar

Phone Number: 9876543210

Address: 12-34 Main St, Rajahmundry, Andhra Pradesh - 533101

Products:
1. Murukulu (250 Grams) x 2 - ₹240.00
2. Jeedi Pappu Pakodi (500 Grams) x 1 - ₹540.00

Total Amount: ₹780.00

Please confirm my order.
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Add a `VITE_API_URL` environment variable pointing to your deployed backend URL.
2. Run `npm run build` in the `frontend` folder to ensure compilation succeeds.
3. Deploy the `frontend/` folder directly to Vercel. Ensure to configure rewrite rules in `vercel.json` if using React Router HTML5 History Mode:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Backend Deployment (Render / Railway)
1. Create a MySQL database instance (e.g., using Railway MySQL or a free database service like Aiven / Clever Cloud).
2. Set up the environment variables on Render/Railway:
   *   `SPRING_DATASOURCE_URL`: `jdbc:mysql://{your-db-host}:{port}/{database}`
   *   `SPRING_DATASOURCE_USERNAME`: your database username
   *   `SPRING_DATASOURCE_PASSWORD`: your database password
   *   `JWT_SECRET`: a 256-bit secure hex key
3. Deploy the backend using the root `pom.xml` located in the `backend/` folder.
