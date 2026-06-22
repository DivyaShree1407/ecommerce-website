# 🛒 ShopEasy — Full Stack E-Commerce Web Application

A complete full-stack e-commerce web application built with Node.js, Express, MongoDB, and React.

---

## 📋 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Future Improvements](#future-improvements)

---

## 📖 About the Project

ShopEasy is a fully functional e-commerce platform where users can browse products, add them to cart,
and place orders. Admins can manage products and update order statuses through a dedicated dashboard.

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM for MongoDB |
| JWT | Authentication |
| bcryptjs | Password hashing |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI library |
| Redux Toolkit | State management |
| React Router | Navigation |
| Axios | API calls |

---

## ✨ Features

### User Features
- Register and login with JWT authentication
- Browse all products with search functionality
- View detailed product information
- Add products to cart
- Checkout with shipping address
- Simulated payment flow
- View order history with status tracking
- Logout

### Admin Features
- Secure admin login
- Add, edit, and delete products
- View all orders
- Filter orders by status
- Update order status (pending → processing → shipped → delivered)

---


### Installation

**Step 1 — Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce-fullstack.git
cd ecommerce-fullstack
```

**Step 2 — Install backend dependencies**
```bash
cd server
npm install
```

**Step 3 — Install frontend dependencies**
```bash
cd ../client
npm install
```

**Step 4 — Setup environment variables**

Create a `.env` file inside the `server/` folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

**Step 5 — Start the backend server**
```bash
cd server
node server.js
```

You should see:
```
✅ MongoDB Connected
Server running on port 5000
```

**Step 6 — Start the frontend**

Open a new terminal:
```bash
cd client
npm start
```

App opens at `http://localhost:3000`

---

## ⚙️ Environment Variables

| Variable | Description | Example |
|---|---|---|
| PORT | Backend server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/ecommerce |
| JWT_SECRET | Secret key for JWT tokens | mysecretkey123 |
| JWT_EXPIRE | Token expiry duration | 7d |

---

## 📡 API Documentation

### Auth Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login user |

### Product Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/products | Public | Get all products |
| GET | /api/products/:id | Public | Get single product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

### Order Routes
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/orders | User | Place new order |
| GET | /api/orders/mine | User | Get my orders |
| GET | /api/orders/:id | User/Admin | Get single order |
| GET | /api/orders | Admin | Get all orders |
| PUT | /api/orders/:id/status | Admin | Update order status |

---

## 🔐 Default Accounts

### Create Admin Account (via Postman)
```json
POST http://localhost:5000/api/auth/register
{
  "name": "Admin",
  "email": "admin@store.com",
  "password": "123456",
  "role": "admin"
}
```

### Create User Account (via Website)
Go to `http://localhost:3000/register` and fill in the form.

---

## 🔄 Order Status Flow

```
pending → processing → shipped → delivered
                ↓
           cancelled
```

---

## 🌐 Running Both Servers

You need **2 terminals** running simultaneously:

```
Terminal 1 (Backend):
cd server && node server.js
→ Runs on http://localhost:5000

Terminal 2 (Frontend):
cd client && npm start
→ Runs on http://localhost:3000
```

---

## 🚀 Future Improvements

- [ ] Stripe payment gateway integration
- [ ] Product image upload with Cloudinary
- [ ] User profile page with edit functionality
- [ ] Product reviews and star ratings
- [ ] Wishlist / favourites feature
- [ ] Email notifications with Nodemailer
- [ ] Advanced search with price range filter
- [ ] Mobile responsive design
- [ ] Deploy to Render + Vercel + MongoDB Atlas
- [ ] Admin sales analytics dashboard

---

## 👩‍💻 Developer

**Divya B**
- Built as a full-stack learning project
- Covers: REST APIs, JWT Auth, MongoDB, React, Redux

---

## 📄 License

This project is for educational purposes.
