# 🛒 ECommerce Backend API

This is a robust and production-ready **Node.js + Express** backend for a full-featured e-commerce platform with rich functionality including product management, authentication, user management, orders, coupons, blogs, wishlist, ratings, and more.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication (access & refresh tokens)
- Admin and user roles
- Block/unblock users
- Password reset via email

### 👤 User Management

- Register, login (user & admin)
- Update profile & password
- Manage saved address
- Wishlist handling

### 🛍️ Product Management

- CRUD operations on products
- Upload product images using **Cloudinary**
- Product filtering, sorting, searching
- Add/remove from wishlist
- Rate and review products

### 🛒 Cart & Orders

- Add items to cart
- Apply coupons to cart
- Place cash-on-delivery order
- View, manage, and clear cart
- Admin can update order status

### 📁 Categories & Brands

- Manage product categories and brands
- Manage blog categories

### 🎟️ Coupons

- Admin can create and manage coupons
- Users can apply valid coupons at checkout

### 📝 Blog System

- Admin can create, update, delete blogs
- Blog image upload
- Like/dislike blog posts

---

## 🧰 Tech Stack

| Tech           | Use                              |
| -------------- | -------------------------------- |
| **Node.js**    | JavaScript runtime               |
| **Express**    | Backend framework                |
| **MongoDB**    | Database                         |
| **Mongoose**   | ODM for MongoDB                  |
| **JWT**        | Authentication                   |
| **Multer**     | File upload handling             |
| **Cloudinary** | Image storage                    |
| **Sharp**      | Image resizing                   |
| **Nodemailer** | Sending email for password reset |
| **Uniqid**     | Generate unique identifiers      |
| **Slugify**    | Create readable URL slugs        |

---

## 📁 Project Structure

```
ecommerce/
│
├── controllers/        # Logic for each module
├── routes/             # API endpoints
├── models/             # Mongoose schemas
├── middlewares/        # Auth, error handlers, image upload
├── utils/              # Reusable utilities
├── config/             # DB and Cloudinary configs
├── index.js              # Entry point
├── .env                # Environment variables
└── package.json
```

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/Doaamahdy/Ecommerce.git
cd Ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

### 4. Start the server

```bash
npm run start
```

---

## 📮 API Routes

| Module    | Endpoint Prefix      |
| --------- | -------------------- |
| Auth/User | `/user/`             |
| Products  | `/product/`          |
| Blogs     | `/blog/`             |
| Blog Cat. | `/blog-category/`    |
| Prod Cat. | `/product-category/` |
| Brand     | `/brand/`            |
| Coupon    | `/coupon/`           |

---

## 📄 Example Scripts (`package.json`)

```json
"scripts": {
  "start": "nodemon app.js"
}
```

---

## 👨‍💻 Developed by

**Doaa Mahdy**
