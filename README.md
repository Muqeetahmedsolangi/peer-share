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

### Health Check
- `GET /` - Health check endpoint

### User Management
- `GET /users` - Get all users

### Room Management
- `POST /create-room` - Create a new room
  - Returns: `{ "success": true, "code": "room_code", "roomId": number }`
- `GET /rooms` - Get all rooms

### Example API Usage

```bash
# Create a room
curl -X POST http://localhost:4000/create-room

# Get all rooms
curl http://localhost:4000/rooms

# Get all users
curl http://localhost:4000/users

# Health check
curl http://localhost:4000/
```

## Database Commands

### Accessing the Database

#### Method 1: Interactive PostgreSQL Shell
```bash
# Connect to PostgreSQL database
docker-compose exec postgres psql -U peer_share -d peer_share_db
```

Once connected, you can use these PostgreSQL commands:

```sql
-- List all databases
\l

-- List all tables
\dt

-- Describe table structure
\d "Users"
\d "SequelizeMeta"

-- View all data in Users table
SELECT * FROM "Users";

-- Count total users
SELECT COUNT(*) FROM "Users";

-- View migration history
SELECT * FROM "SequelizeMeta";

-- Show table columns with details
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'Users';

-- Exit PostgreSQL shell
\q
```

#### Method 2: One-line Commands from Terminal

```bash
# List all tables
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

# View all users
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT * FROM \"Users\";"

# Count users
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT COUNT(*) FROM \"Users\";"

# View table structure
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'Users';"

# Check migration status
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT * FROM \"SequelizeMeta\";"

# View database size
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT pg_size_pretty(pg_database_size('peer_share_db'));"
```

#### Method 3: Connect from Host Machine
```bash
# Connect directly from your machine (requires PostgreSQL client)
psql -h localhost -p 5433 -U peer_share -d peer_share_db
```

### Database Management

#### Backup and Restore
```bash
# Create database backup
docker-compose exec postgres pg_dump -U peer_share peer_share_db > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U peer_share -d peer_share_db < backup.sql

# Create compressed backup
docker-compose exec postgres pg_dump -U peer_share -Fc peer_share_db > backup.dump
```

#### Migration Commands
```bash
# Run pending migrations (RECOMMENDED - inside Docker)
docker-compose exec backend npx sequelize-cli db:migrate

# Run migrations locally (set DATABASE_URL)
cd backend
DATABASE_URL=postgres://peer_share:mySecurePass123@localhost:5433/peer_share_db npx sequelize-cli db:migrate

# Rollback last migration
docker-compose exec backend npx sequelize-cli db:migrate:undo

# Check migration status
docker-compose exec backend npx sequelize-cli db:migrate:status

# Create new migration
docker-compose exec backend npx sequelize-cli migration:generate --name migration-name
```

#### Monitoring and Logs
```bash
# View database logs
docker-compose logs postgres

# Monitor database activity
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT * FROM pg_stat_activity WHERE datname = 'peer_share_db';"

# Check database connections
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'peer_share_db';"
```

#### Database Administration
```bash
# Reset database (⚠️ This will delete all data)
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Restart database service
docker-compose restart postgres

# View database configuration
docker-compose exec postgres psql -U peer_share -d peer_share_db -c "SHOW ALL;"
```

### Using pgAdmin (Web Interface)

If you prefer a graphical interface:

```bash
# Start pgAdmin container
docker run --name pgadmin \
  --network peer-share_default \
  -p 8080:80 \
  -e PGADMIN_DEFAULT_EMAIL=admin@admin.com \
  -e PGADMIN_DEFAULT_PASSWORD=admin \
  -d dpage/pgadmin4
```

Then access pgAdmin at: `http://localhost:8080`

**Connection details for pgAdmin:**
- Host: `postgres`
- Port: `5432`
- Database: `peer_share_db`
- Username: `peer_share`
- Password: `mySecurePass123`

## Troubleshooting

### Common Issues

#### Migration Error: "Error parsing url: undefined"

If you get this error when running migrations:
```
ERROR: Error parsing url: undefined
```

**Solution:**
Use one of these methods:

1. **Run inside Docker container (Recommended):**
```bash
docker-compose exec backend npx sequelize-cli db:migrate
```

2. **Set DATABASE_URL locally:**
```bash
cd backend
DATABASE_URL=postgres://peer_share:mySecurePass123@localhost:5433/peer_share_db npx sequelize-cli db:migrate
```

3. **Use dotenv for local development:**
```bash
cd backend
npm install --save-dev dotenv-cli
npx dotenv -e config.env -- npx sequelize-cli db:migrate
```

#### Container Connection Issues

If you can't connect to the database:

1. **Check if containers are running:**
```bash
docker-compose ps
```

2. **Restart services:**
```bash
docker-compose restart
```

3. **View logs:**
```bash
docker-compose logs postgres
docker-compose logs backend
```

#### Port Already in Use

If you get port conflict errors:
```bash
# Stop all containers
docker-compose down

# Check what's using the port
lsof -i :4000
lsof -i :5433

# Kill the process or change ports in docker-compose.yml
```

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
