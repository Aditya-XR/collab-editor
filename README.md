# Collaborative Editor

Full-stack collaborative editor foundation built with React, Vite, Node.js, Express, MongoDB Atlas, and Upstash Redis.

## Project Structure

```text
client/
server/
.env.example
README.md
```

## Install Dependencies

Install all workspace dependencies from the project root:

```bash
npm install
```

## Environment Setup

Copy the root `.env.example` file into `server/.env` and fill in your values:

```bash
cp .env.example server/.env
```

Required variables:

```env
PORT=
MONGO_URI=
REDIS_URL=
JWT_SECRET=
CLIENT_URL=
```

`CLIENT_URL` should match the frontend development origin. `PORT` controls the backend port.

## Run The Server

```bash
npm run dev --workspace server
```

For production-style startup:

```bash
npm run start --workspace server
```

## Run The Client

```bash
npm run dev --workspace client
```

## Health Check

Once the server is running, check:

```text
GET /api/v1/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {},
  "errors": []
}
```
