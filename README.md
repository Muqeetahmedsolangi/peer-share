# PeerShare

A peer-to-peer sharing application built with Node.js, TypeScript, and PostgreSQL.

## Features

- User management with authentication providers
- RESTful API endpoints
- PostgreSQL database with Sequelize ORM
- Docker containerization
- Environment-based configuration
- Automatic database migrations

## Tech Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Containerization**: Docker & Docker Compose
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/Muqeetahmedsolangi/peer-share.git
cd peer-share
```

2. Start the application:
```bash
docker-compose up --build
```

3. The application will be available at:
   - API: http://localhost:4000
   - Database: localhost:5433

### Local Development

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp config.env.example config.env
# Edit config.env with your settings
```

4. Run migrations:
```bash
npx sequelize-cli db:migrate
```

5. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `GET /` - Health check endpoint
- `GET /users` - Get all users

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 4000)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DATABASE_URL` - Complete database connection string

## Project Structure

```
peer-share/
├── backend/
│   ├── config/
│   │   ├── config.json
│   │   └── database.ts
│   ├── migrations/
│   ├── models/
│   ├── package.json
│   ├── dockerfile
│   └── index.ts
├── docker-compose.yml
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
