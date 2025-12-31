# E-Commerce Platform API

> A comprehensive e-commerce backend built with NestJS, MongoDB, Redis, and Stripe integration.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [License](#license)

---

## About

A production-ready e-commerce REST API featuring user authentication, product management, shopping cart, order processing, and Stripe payment integration. Built with TypeScript and follows clean architecture principles for maintainability and scalability.

---

## Features

- 🔐 JWT Authentication (access & refresh tokens)
- 📧 Email verification system
- 👤 User profile management with S3 image upload
- 🛍️ Product, Category, and Brand management
- 🛒 Shopping cart with persistence
- 🎟️ Coupon system with discount validation
- 💳 Stripe payment integration (checkout, payment intent, refunds)
- ⚡ Redis caching for optimized performance
- 🔒 Rate limiting and security middleware
- 📝 Input validation with Zod schemas
- 🗑️ Soft delete functionality
- 📱 Phone number encryption
- 🔑 Password hashing with bcrypt

---

## Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)
- AWS S3 account
- Stripe account

### Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/ecommerce-platform.git

# Navigate to project directory
cd ecommerce-platform

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables (see Configuration section)

# Run the application
npm run start:dev
```

---

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
BASE_URL=http://localhost:3000

# Database
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
DB_CLUSTER=your_cluster_name
DB_NAME=ecommerce_db

# JWT
JWT_TOKEN_SECRET_KEY=your_jwt_secret_key_here
JWT_ACCESS_EXPIRATION=3600
JWT_REFRESH_EXPIRATION=604800
JWT_CONFIRM_EMAIL_EXPIRATION=86400

# Encryption
CRYPTO_SECRET_KEY=your_crypto_secret_key
BCRYPT_SALT_ROUNDS=10

# Email (Gmail)
GOOGLE_EMAIL_TARNSPORTER=your_email@gmail.com
GOOGLE_EMAIL_TARNSPORTER_PASSWORD=your_app_password

# AWS S3
REGION=us-east-1
BUCKET_NAME=your-bucket-name
ACCESS_KEY_ID=your_access_key
SECRET_ACCESS_KEY=your_secret_key

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

---

## Usage

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/confirm-email?token=xxx` | Verify email | No |
| POST | `/api/auth/refresh-token` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | Yes |

### User

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update profile | Yes |
| POST | `/api/user/profile-picture` | Upload profile picture | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Yes (Admin) |
| PUT | `/api/products/:id` | Update product | Yes (Admin) |
| DELETE | `/api/products/:id` | Delete product | Yes (Admin) |
| POST | `/api/products/:id/favorite` | Toggle favorite | Yes |

### Categories

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/categories` | Get all categories | No |
| GET | `/api/categories/:id` | Get single category | No |
| POST | `/api/categories` | Create category | Yes (Admin) |
| PUT | `/api/categories/:id` | Update category | Yes (Admin) |
| DELETE | `/api/categories/:id` | Delete category | Yes (Admin) |

### Brands

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/brands` | Get all brands | No |
| GET | `/api/brands/:id` | Get single brand | No |
| POST | `/api/brands` | Create brand | Yes (Admin) |
| PUT | `/api/brands/:id` | Update brand | Yes (Admin) |
| DELETE | `/api/brands/:id` | Delete brand | Yes (Admin) |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| PUT | `/api/cart/:itemId` | Update cart item | Yes |
| DELETE | `/api/cart/:itemId` | Remove from cart | Yes |
| DELETE | `/api/cart` | Clear cart | Yes |

### Coupons

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/coupons` | Create coupon | Yes (Admin) |
| POST | `/api/coupons/apply` | Apply coupon to cart | Yes |
| GET | `/api/coupons` | Get all coupons | Yes (Admin) |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |

### Payment (Stripe)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payment/checkout-session` | Create checkout session | Yes |
| POST | `/api/payment/payment-intent` | Create payment intent | Yes |
| POST | `/api/payment/confirm` | Confirm payment | Yes |
| POST | `/api/payment/refund` | Process refund | Yes (Admin) |

---

## Technologies

### Core

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Typed JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Redis** - In-memory caching

### Authentication & Security

- **JWT** - JSON Web Tokens
- **bcrypt** - Password hashing
- **crypto-js** - Data encryption
- **express-rate-limit** - Rate limiting

### File Storage

- **AWS S3** - Cloud file storage
- **Multer** - File upload handling

### Payment

- **Stripe** - Payment processing

### Email

- **Nodemailer** - Email sending

### Validation

- **Zod** - Schema validation

---

## Project Structure

```
src/
├── db/
│   ├── models/                    # Mongoose models
│   │   ├── user.model.ts
│   │   ├── revoked-token.model.ts
│   │   ├── product.model.ts
│   │   ├── category.model.ts
│   │   ├── brand.model.ts
│   │   ├── cart.model.ts
│   │   ├── order.model.ts
│   │   └── coupon.model.ts
│   ├── database.repository.ts     # Generic repository
│   └── database.connection.ts     # DB connection
│
├── modules/
│   ├── auth/                      # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.repository.ts
│   │   ├── auth.module.ts
│   │   ├── auth.dto.ts
│   │   └── auth.validation.ts
│   ├── user/                      # User module
│   ├── product/                   # Product module
│   ├── category/                  # Category module
│   ├── brand/                     # Brand module
│   ├── cart/                      # Cart module
│   ├── order/                     # Order module
│   ├── coupon/                    # Coupon module
│   └── payment/                   # Payment module
│
├── common/                        # Shared resources
│   ├── config/                    # Configuration files
│   │   ├── s3.config.ts
│   │   ├── mailer.config.ts
│   │   ├── rate-limiter.config.ts
│   │   └── uploader.config.ts
│   ├── constants/                 # Application constants
│   ├── decorators/                # Custom decorators
│   ├── enums/                     # Enumerations
│   ├── errors/                    # Custom error classes
│   ├── guards/                    # Route guards
│   ├── interceptors/              # Interceptors
│   ├── middlewares/               # Middleware functions
│   ├── pipes/                     # Validation pipes
│   ├── responses/                 # Response helpers
│   ├── templates/                 # Email templates
│   ├── types/                     # TypeScript types
│   └── utils/                     # Utility functions
│       ├── encryption.util.ts
│       ├── hash.util.ts
│       ├── s3.util.ts
│       ├── send-email.util.ts
│       ├── token.util.ts
│       └── uploader.util.ts
│
├── app.module.ts                  # Root module
└── main.ts                        # Application entry point
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, please contact:

- **Linkid**: https://www.linkedin.com/in/youssef-el-azab-054348356/
- **GitHub**: [@YoussefCodeHub](https://github.com/YoussefCodeHub)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ using NestJS
