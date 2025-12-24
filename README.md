# NYT Games Weekly Competition

A full-stack application for tracking and competing in NYT Games (Wordle, Connections, Strands, Mini Crossword). -mroth

## Features

- **Leaderboard**: View weekly rankings based on game scores
- **User Management**: Add and manage competitors
- **ETL Pipeline**: Automated data extraction from NYT Games
- **Docker Support**: Easy deployment with docker-compose

## Architecture

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + Vite
- **Database**: PostgreSQL with migrations and seed data
- **Containerization**: Docker + Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose installed

### Running the Application

```bash
# Start all services
docker-compose up --build

# The app will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:3001
```

### Development

#### Backend

```bash
cd backend
npm install
npm run dev    # Start development server with hot reload
npm run etl    # Run ETL process manually
```

#### Frontend

```bash
cd frontend
npm install
npm run dev    # Start Vite dev server
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Backend server port (default: 3001)
- `NYT_COOKIE`: NYT session cookie for ETL (optional)

## Database

The PostgreSQL database is automatically initialized with:
- Schema from `backend/migrations/init.sql`
- Sample data from `backend/seed/dummy.sql`

## API Endpoints

- `GET /api/leaderboard`: Fetch weekly leaderboard
- `GET /api/users`: List all users
- `POST /api/users`: Add a new user
- `PUT /api/users/:id`: Update user settings

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── index.js           # Express server
│   │   ├── db.js              # Database connection
│   │   ├── etl.js             # ETL pipeline
│   │   └── routes/            # API routes
│   ├── migrations/            # Database schema
│   ├── seed/                  # Seed data
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── components/        # React components
│   │   ├── api.js             # API client
│   │   └── styles.css         # Global styles
│   └── Dockerfile
└── docker-compose.yml
```

## License

MIT