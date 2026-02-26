# E-Commerce Backend API

Production-grade backend API built with Express, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with refresh token rotation
- 📧 Email notifications with Nodemailer
- 💳 Mocked payment gateway with failure simulation
- 🗄️ Redis caching and OTP storage
- 📊 Database per module with Prisma
- 🚀 Docker containerization
- 📝 Comprehensive logging and monitoring
- ⚡ Rate limiting and security headers

## Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Validation**: Zod
- **Security**: Helmet, BCRYPT, JWT

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection URL
- `JWT_ACCESS_SECRET`: Access token secret
- `JWT_REFRESH_SECRET`: Refresh token secret
- `EMAIL_USER`: Sender email
- `EMAIL_PASS`: Email password/app-specific password

## Development

```bash
# Start development server with hot reload
npm run dev

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
```

## Building

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Docker

```bash
# Using docker-compose
docker-compose up --build

# Production build
docker build -t ecommerce-server .
docker run -p 3000:3000 ecommerce-server
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/password-reset/initiate` - Request password reset
- `POST /api/auth/password-reset/confirm` - Reset password
- `POST /api/auth/phone/otp/send` - Send OTP to phone
- `POST /api/auth/phone/otp/verify` - Verify phone OTP

### Products

- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get all categories

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove/:itemId` - Remove item from cart

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

## Monitoring

- `GET /health` - Health check
- `GET /readiness` - Readiness probe

## Project Structure

```
src/
├── config/          # Configuration (env, database)
├── middleware/      # Express middleware
├── modules/         # Feature modules
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── order/
│   ├── user/
│   ├── payment/
│   ├── admin/
│   ├── notification/
│   └── monitoring/
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── routes/          # Route definitions
├── index.ts         # Express app setup
└── server.ts        # Server entry point

prisma/
├── schema.prisma    # Main schema file
└── schemas/         # Modular schema files
```

## Security

- ✅ HTTPS only (enforced in production)
- ✅ HTTP-only cookies for tokens
- ✅ CSRF protection ready
- ✅ Rate limiting per user/IP
- ✅ Input validation with Zod
- ✅ Password hashing with bcrypt
- ✅ Safe error messages (no sensitive data)
- ✅ Security headers with Helmet

## Performance

- Redis caching for products and sessions
- Database query optimization with indexes
- Lazy loading of relations
- Connection pooling for database
- Compression middleware ready

## Error Handling

Standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": {}
  },
  "timestamp": "2024-02-22T10:00:00Z"
}
```

## Contributing

Follow conventional commit style:

- `feat: add new feature`
- `fix: fix bug`
- `refactor: code restructuring`
- `test: add tests`
- `docs: documentation updates`

## License

MIT
