# Local Development Setup

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env.local file (or copy from .env.example)
# Create file: backend/.env.local
```

**backend/.env.local:**
```env
NODE_ENV=development
PORT=4000
FRONTEND_URL=http://localhost:3000
```

**Start backend:**
```bash
npm run dev
# Server runs on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd client

# Install dependencies
pnpm install

# Create .env.local file
# Create file: client/.env.local
```

**client/.env.local:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

**Start frontend:**
```bash
pnpm dev
# Frontend runs on http://localhost:3000
```

### 3. Testing Locally

1. Open **two browser windows/tabs**:
   - Window 1: `http://localhost:3000/same-wifi`
   - Window 2: `http://localhost:3000/same-wifi`

2. Enter different usernames in each window

3. Both should see each other in the users list

4. Share files/text messages between them

## Environment Variables

### Backend (.env.local)
- `NODE_ENV=development` - Development mode
- `PORT=4000` - Backend port
- `FRONTEND_URL=http://localhost:3000` - Frontend URL for CORS

### Frontend (.env.local)
- `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000` - Backend URL for socket connection

**Note:** The frontend will automatically use `http://localhost:4000` if running on localhost, even without the env variable.

## Testing on Same WiFi Network

To test the WiFi network isolation feature:

1. Use multiple devices on the same WiFi network
2. Access `http://YOUR_LOCAL_IP:3000/same-wifi` from each device
3. All devices should see each other and can share files

**Find your local IP:**
- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

Example: `http://192.168.1.100:3000/same-wifi`

