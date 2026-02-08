# JWT Authentication Example

A simple JWT-based authentication system built with Node.js/Express, MongoDB, and vanilla HTML/CSS/JS frontend.

## Features

- User registration with password hashing (bcryptjs)
- User login with JWT token generation
- Protected routes with token validation
- Token stored in localStorage on frontend
- Logout functionality
- Simple and educational codebase

## Project Structure

```
├── server.js              # Express server setup
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   └── User.js           # User schema
├── routes/
│   ├── auth.js           # Authentication routes
│   └── protected.js      # Protected routes example
├── middleware/
│   └── auth.js           # JWT verification middleware
├── public/
│   ├── index.html        # Frontend - Login/Register page
│   ├── dashboard.html    # Frontend - Protected page
│   ├── styles.css        # Styling
│   └── app.js            # Frontend logic
├── package.json
├── .env.example
└── .gitignore
```

## Installation

1. **Clone or extract the project**
   ```bash
   cd JWT_auth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

4. **Ensure MongoDB is running**
   ```bash
   # MongoDB should be running on mongodb://localhost:27017
   ```

5. **Start the server**
   ```bash
   npm start          # Production mode
   npm run dev        # Development mode with nodemon
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## How It Works

### Backend Flow

1. **User Registration** (POST `/api/auth/register`)
   - Receives username and password
   - Hashes password with bcryptjs
   - Stores user in MongoDB

2. **User Login** (POST `/api/auth/login`)
   - Validates credentials
   - Generates JWT token if valid
   - Returns token to frontend

3. **Protected Routes** (GET `/api/protected/profile`)
   - Middleware verifies JWT token
   - Returns user data if token is valid

### Frontend Flow

1. User enters credentials on login page
2. Sends credentials to backend
3. Receives JWT token
4. Stores token in localStorage
5. Redirects to dashboard
6. Dashboard sends token with each request
7. Backend validates token and returns protected data

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: `{ username, password }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ username, password }`
  - Returns: `{ token }`

### Protected Routes
- `GET /api/protected/profile` - Get user profile (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ username, message }`

## Token Format

JWT tokens are sent in the `Authorization` header with the format:
```
Authorization: Bearer <token>
```

## Security Notes

**This is an educational example. For production:**
- Change JWT secret in `.env`
- Use HTTPS only
- Add rate limiting
- Add input validation and sanitization
- Add password requirements (min length, complexity)
- Implement refresh tokens
- Add CORS restrictions
- Use secure HTTP-only cookies instead of localStorage

## Course Learning Points

- How JWT tokens work
- Password hashing with bcryptjs
- Middleware for authentication
- MongoDB integration with Mongoose
- Frontend-backend communication with tokens
- Protected API routes

## Learn More About JWT

- **JWT Official Site**: https://jwt.io/ - Learn about JWT structure, encoding/decoding, and test tokens
- **OAuth 2.0 & JWT**: https://tools.ietf.org/html/rfc7519 - Official JWT specification (RFC 7519)
- **MDN - Web Authentication**: https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication
- **Node.js JWT Tutorial**: https://www.npmjs.com/package/jsonwebtoken - jsonwebtoken package documentation
- **OWASP Authentication Guide**: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html

## License

MIT
