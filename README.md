This is a [Next.js](https://nextjs.org) project for Loyapara Services.

## Getting Started

1) Install dependencies:

```bash
npm install
```

2) Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=your_database_name

# Admin login (for /login and /Dashboard access)
AUTH_SECRET=your_long_random_secret
ADMIN_PHONE=017XXXXXXXX
ADMIN_PASSWORD=your_secure_password

# Image upload proxy
IMGBB_API_KEY=your_imgbb_api_key
```

3) Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Flow

- Go to `/login` and sign in with `ADMIN_PHONE` + `ADMIN_PASSWORD`.
- After login, `/Dashboard` becomes accessible.
- From dashboard you can edit/delete:
  - complaints
  - lostFound posts

## API routes added/updated

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET, POST /api/complain`
- `PATCH, DELETE /api/complain/[id]`
- `GET, POST /api/lostFound`
- `PATCH, DELETE /api/lostFound/[id]`
- `POST /api/upload/image`

## Build

```bash
npm run build
```
