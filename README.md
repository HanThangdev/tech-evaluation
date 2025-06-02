# Technical Assessment Project

A modern web application built with Next.js, Express, and Prisma, featuring authentication, internationalization, and blockchain integration.

## Features

- 🔐 Authentication system
- 🌐 Internationalization support (i18n)
- ⚡ Next.js 15 with TurboPack
- 🎨 Tailwind CSS for styling
- 🔗 Blockchain integration with Ethers.js
- 🗄️ Prisma ORM with MongoDB
- 🔒 Security features (XSS protection, Rate limiting, etc.)
- 🚀 Express.js backend API

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Version 23.4.0 or higher
- **Porsgresql**: Latest version
- **Git**: For version control

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration values.

4. Set up the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

## Development

To run the development server:

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend
```

- Frontend will be available at: http://localhost:3000
- Backend API will be available at: http://localhost:3001

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/          # Next.js application files
├── api/          # Express backend API
├── prisma/       # Database schema and migrations
├── public/       # Static files
├── services/     # Service layer
├── i18n/         # Internationalization files
├── lib/          # Shared utilities
├── contract/     # Blockchain contract files
└── messages/     # i18n messages
```

## Technologies Used

- **Frontend**:
  - Next.js 15
  - React 19
  - TailwindCSS
  - HeadlessUI
  - Motion for animations

- **Backend**:
  - Express.js
  - Prisma ORM
  - MongoDB
  - JWT Authentication

- **Blockchain**:
  - Ethers.js
  - Bitcoin Core (dev dependency)

- **Development Tools**:
  - TypeScript
  - ESLint
  - Prisma Studio
  - Nodemon

## Security Features

- Express Mongo Sanitize
- XSS Protection
- Helmet Security Headers
- Rate Limiting
- HPP (HTTP Parameter Pollution) Protection
- CORS Configuration

## Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed the database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and confidential. All rights reserved.

---

For more information or support, please contact the development team.

