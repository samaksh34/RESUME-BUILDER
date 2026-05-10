# Resume Builder - Complete Backend Implementation Guide

**Created:** May 10, 2026  
**Purpose:** Complete technical documentation for interview preparation and understanding

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
4. [Core Concepts Explained](#core-concepts-explained)
5. [Detailed Implementation](#detailed-implementation)
6. [API Endpoints](#api-endpoints)
7. [Security Features](#security-features)
8. [Common Interview Questions & Answers](#common-interview-questions--answers)

---

## Project Overview

### What is this project?
The Resume Builder is a **full-stack web application** that allows users to:
- Create accounts securely with email verification
- Build, edit, and delete resumes
- Save multiple resume versions
- Access their resumes anytime from any device

### Backend Responsibility
The backend (Node.js + Express) handles:
- User authentication and authorization
- User data storage and retrieval
- Resume CRUD operations (Create, Read, Update, Delete)
- Email notifications (OTP verification, password reset)
- Security (password hashing, JWT tokens, rate limiting)

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose | Location |
|-----------|---------|---------|----------|
| **Node.js** | Latest | JavaScript runtime | `server.js` |
| **Express.js** | ^4.19.2 | Web framework & routing | `server.js`, `routes/` |
| **MongoDB** | Cloud | NoSQL database | `config/db.js` |
| **Mongoose** | ^8.4.0 | MongoDB ODM (Object mapping) | `models/` |

### Authentication & Security
| Technology | Version | Purpose | Location |
|-----------|---------|---------|----------|
| **JWT (jsonwebtoken)** | ^9.0.2 | Token-based authentication | `utils/generateToken.js` |
| **bcryptjs** | ^2.4.3 | Password hashing & OTP hashing | `models/User.js` |
| **express-rate-limit** | ^7.2.0 | API request throttling | `server.js:39-48` |
| **cookie-parser** | ^1.4.6 | HTTP cookie parsing | `server.js:36` |

### Validation & Email
| Technology | Version | Purpose | Location |
|-----------|---------|---------|----------|
| **Joi** | ^17.13.1 | Schema validation | `utils/validators.js` |
| **Nodemailer** | ^6.9.13 | Email sending | `services/emailService.js` |

### Development
| Tool | Version | Purpose |
|------|---------|---------|
| **Nodemon** | ^3.1.0 | Auto-reload during development |
| **dotenv** | ^16.4.5 | Environment variables |
| **CORS** | ^2.8.5 | Cross-origin requests |

---

## Project Architecture

### Directory Structure
```
backend/
├── server.js                 # Entry point, app setup
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   ├── User.js              # User schema & methods
│   └── Resume.js            # Resume schema
├── controllers/
│   ├── authController.js    # Auth logic
│   └── resumeController.js  # Resume logic
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── resumeRoutes.js      # Resume endpoints
├── middleware/
│   ├── auth.js              # JWT verification, validation
│   └── errorHandler.js      # Global error handling
├── services/
│   └── emailService.js      # Email sending logic
├── utils/
│   ├── generateToken.js     # JWT creation/verification
│   └── validators.js        # Input validation schemas
├── .env                     # Environment variables
└── package.json             # Dependencies
```

### Data Flow Diagram
```
REQUEST → ROUTES → VALIDATION → CONTROLLER → MODELS → RESPONSE
                        ↓
                   MIDDLEWARE
                   (Auth, Error)
```

**Example Flow: Register User**
1. Client sends POST to `/api/auth/register`
2. Route receives request → `authRoutes.js:26`
3. Validation middleware checks input → `middleware/auth.js:55-68`
4. Controller logic executes → `authController.js:10-53`
5. User model saves to DB → `models/User.js:51-56`
6. Email service sends OTP → `services/emailService.js:27-99`
7. Response sent back to client

---

## Core Concepts Explained

### 1. **JWT (JSON Web Token) Authentication**

**What is JWT?**
A JWT is a digitally signed token that proves a user's identity without storing sessions on the server.

**How it works:**
```
Login → Server creates JWT → Client stores JWT → Client sends JWT with each request → Server verifies JWT
```

**In this project:**
- **Access Token**: Short-lived (15 minutes) - used for API requests
- **Refresh Token**: Long-lived (7 days) - stored in secure HTTP-only cookies to get new access tokens

**Code Location:**
- JWT Generation: `utils/generateToken.js:6-19`
- JWT Verification: `middleware/auth.js:24`
- Cookie Storage: `authController.js:94-99` (login), `authController.js:259-264` (refresh)

**Why use JWT?**
✅ Stateless (server doesn't need to store session data)  
✅ Scalable (works with multiple servers)  
✅ Mobile-friendly (can be stored in local storage)  
✅ Secure (digitally signed)

---

### 2. **Password Hashing with bcryptjs**

**What is hashing?**
Hashing converts plain text into a fixed-length irreversible code. Same input always produces same hash.

```
Password: "myPassword123"
Hashed: "$2a$12$abc123...xyz789" (stored in DB)

When user logs in:
Entered: "myPassword123"
Hash & Compare: ✓ Matches stored hash → Login successful
```

**Salt (security boost):**
A random string added before hashing to prevent rainbow table attacks.

```javascript
Salt generation: bcrypt.genSalt(12)  // 12 rounds = very secure
Password hashing: bcrypt.hash(password, salt)
```

**Code Location:**
- Password hashing on save: `models/User.js:51-56`
- Password comparison: `models/User.js:59-61`
- OTP hashing: `models/User.js:64-74` (same concept for OTP)

---

### 3. **OTP (One-Time Password) Verification**

**What is OTP?**
A 6-digit code sent to user's email that expires in 10 minutes. Used for:
- Email verification during signup
- Password reset verification

**Flow:**
```
1. User requests signup/password reset
2. Server generates random 6-digit OTP
3. OTP hashed and stored in DB (not plain text!)
4. Plain OTP sent to user's email
5. User enters OTP
6. Server compares entered OTP with stored hashed OTP
7. If match & not expired → Verify user
```

**Code Location:**
- Generate OTP: `models/User.js:64-74`
- Verify OTP: `models/User.js:77-82`
- Send OTP email: `services/emailService.js:27-99`
- Clear OTP after use: `models/User.js:85-87`

---

### 4. **Middleware**

**What is middleware?**
Functions that process requests before reaching controllers. They can modify requests, block access, or validate data.

**Types in this project:**

**a) Validation Middleware** (`middleware/auth.js:55-68`)
```javascript
Validates req.body against Joi schema
↓
If invalid → Return 400 error
↓
If valid → Pass to controller
```

**b) Authentication Middleware** (`middleware/auth.js:7-50`)
```javascript
Extracts JWT from Authorization header
↓
Verifies JWT signature
↓
If invalid/expired → Return 401 (Unauthorized)
↓
If valid → Attach user to req object → Continue to controller
```

**c) Error Handler Middleware** (`middleware/errorHandler.js`)
```javascript
Catches all errors from controllers
↓
Converts to appropriate HTTP status code
↓
Sends formatted error response
```

**Request Flow with Middleware:**
```
Incoming Request
    ↓
CORS Middleware (check origin)
    ↓
Body Parser Middleware (parse JSON)
    ↓
Cookie Parser Middleware (parse cookies)
    ↓
Rate Limiter (check request count)
    ↓
Routes
    ↓
Validation Middleware (check input)
    ↓
Auth Middleware (verify JWT)
    ↓
Controller
    ↓
Error Handler (if error occurs)
    ↓
Response Sent
```

---

### 5. **Database Relationships**

**One-to-Many Relationship:**
```
User (1) ──── (Many) Resumes
```

A user can have multiple resumes, but each resume belongs to only one user.

**Implementation:**
- `models/Resume.js:5-9` - Resume has reference to User via `ObjectId`
- `models/Resume.js:29` - Index on user field for faster queries

---

### 6. **CORS (Cross-Origin Resource Sharing)**

**Why needed?**
Frontend (different domain/port) needs to access backend API.

**Implementation:** `server.js:19-32`
```javascript
Allowed origins: Read from CLIENT_URL env variable
Dynamic origin check: Only allow registered origins
credentials: true: Allow cookies with cross-origin requests
```

---

### 7. **Rate Limiting**

**What is it?**
Restricts number of requests from a single IP in a time window to prevent abuse.

**Implementation:** `server.js:39-48`
```javascript
Max 100 requests per 15 minutes
Applied only to auth routes (register, login, etc.)
Prevents brute force attacks
```

---

## Detailed Implementation

### 1. User Model (`models/User.js`)

**Schema Fields:**
```javascript
{
  name: String (2-50 chars),              // User's full name
  email: String (unique),                 // Login identifier
  password: String (hashed),              // Not returned by default
  avatar: String (URL),                   // Profile picture
  isVerified: Boolean (default: false),    // Email verification status
  otp: {
    code: String (hashed),                // OTP code
    expiresAt: Date,                      // 10-minute expiry
    purpose: 'verification' | 'password-reset'
  },
  refreshTokens: [String],                // Array of valid tokens (multi-device)
  timestamps: true                        // createdAt, updatedAt
}
```

**Key Methods:**

**a) Pre-save Hook** (Lines 51-56)
```javascript
Whenever user.save() is called:
IF password was modified:
  - Generate salt (12 rounds)
  - Hash password
  - Save hashed version (original never stored)
```

**b) comparePassword()** (Lines 59-61)
```javascript
user.comparePassword(enteredPassword)
→ Compares entered password's hash with stored hash
→ Returns true/false
```

**c) generateOTP()** (Lines 64-74)
```javascript
Generates random 6-digit OTP
Hashes the OTP
Stores hashed OTP + expiry time
Returns plain OTP (to send via email)
```

**d) verifyOTP()** (Lines 77-82)
```javascript
Compares entered OTP's hash with stored hash
Checks if OTP hasn't expired
Checks if purpose matches
Returns true/false
```

---

### 2. Resume Model (`models/Resume.js`)

**Schema Fields:**
```javascript
{
  user: ObjectId,              // Reference to User (required)
  data: Object,                // Complete resume content
  title: String,               // Resume name
  isLastModified: Boolean,     // Track latest resume
  timestamps: true             // createdAt, updatedAt
}
```

**Why flexible Object field?**
Allows storing resume in any structure:
```javascript
{
  personalInfo: { name, email, phone },
  experience: [ { company, role, duration } ],
  education: [ { degree, school, year } ],
  skills: [ "JavaScript", "React", ... ],
  projects: [ { name, description, link } ]
}
```

---

### 3. Authentication Controller (`controllers/authController.js`)

#### Endpoint 1: Register
**Location:** `authController.js:10-53`

**Flow:**
```
1. Extract: name, email, password from req.body
2. Check if user with email exists
   - If exists & verified → Return 400 (account already exists)
   - If exists & NOT verified → Allow re-registration, resend OTP
3. Create new user with hashed password
4. Generate 6-digit OTP
5. Send OTP to email
6. Return 201 (Created)
```

**Key Code:**
```javascript
const user = new User({ name, email, password });
const otp = await user.generateOTP('verification');
await user.save();  // Password auto-hashed by pre-hook
await sendOTPEmail(email, otp, 'verification');
```

---

#### Endpoint 2: Verify OTP
**Location:** `authController.js:60-118`

**Flow:**
```
1. Extract: email, otp from req.body
2. Find user by email
3. Verify OTP:
   - Check OTP hash matches
   - Check purpose is 'verification'
   - Check not expired (10 minutes)
4. If valid:
   - Mark user as verified
   - Clear OTP
   - Generate access token (15 min)
   - Generate refresh token (7 days)
   - Store refresh token in DB
   - Set refresh token in HTTP-only cookie
5. Return access token to client
```

**Why HTTP-only cookie for refresh token?**
- Cannot be accessed by JavaScript (XSS attack protection)
- Automatically sent with every request
- Cannot be stolen via malicious scripts

---

#### Endpoint 3: Login
**Location:** `authController.js:125-202`

**Flow:**
```
1. Extract: email, password
2. Find user (include password field with .select('+password'))
3. Compare entered password with stored hashed password
4. Check if user is verified
   - If NOT verified → Resend OTP, return 403 (Forbidden)
5. If verified:
   - Generate tokens
   - Store refresh token in DB (keep max 5 tokens for multi-device)
   - Set refresh token cookie
   - Return access token
```

**Why store refresh tokens?**
- Allows token revocation (logout from specific device)
- Detects token reuse (security threat)
- Supports multiple devices/sessions

---

#### Endpoint 4: Refresh Access Token
**Location:** `authController.js:209-275`

**Flow:**
```
1. Extract refresh token from cookies
2. Verify refresh token signature
3. Find user by token's userId
4. Check if token exists in user's stored tokens
   - If NOT found → Token reuse detected!
   - Clear all tokens (user was compromised)
   - Return 401
5. If found:
   - Remove old refresh token
   - Generate new access token
   - Generate new refresh token
   - Store new refresh token in DB
   - Return new access token
```

**Token Rotation Pattern:**
```
Old RefreshToken → Used to get NewAccessToken + NewRefreshToken → OldRefreshToken deleted
```

---

#### Endpoint 5: Forgot Password
**Location:** `authController.js:282-308`

**Flow:**
```
1. Extract: email
2. Find user
3. Generate OTP (purpose: 'password-reset')
4. Send OTP to email
5. Return success (even if user not found - security)
```

---

#### Endpoint 6: Reset Password
**Location:** `authController.js:315-350`

**Flow:**
```
1. Extract: email, otp, newPassword
2. Find user
3. Verify OTP (purpose: 'password-reset')
4. Update password (auto-hashed)
5. Clear OTP
6. Revoke all refresh tokens (force re-login everywhere)
7. Return success
```

---

#### Endpoint 7: Logout
**Location:** `authController.js:388-410`

**Flow:**
```
1. Extract refresh token from cookies
2. Find user
3. Remove THIS specific refresh token from array
4. Clear refresh token cookie
5. Return success
```

**Why remove specific token?**
User might be logged in on 3 devices. Logout from one device shouldn't logout from others.

---

#### Endpoint 8: Get Current User
**Location:** `authController.js:417-435`

**Flow:**
```
1. Extract user from req.user (set by auth middleware)
2. Return user data (no password)
```

---

### 4. Resume Controller (`controllers/resumeController.js`)

#### Get All Resumes
**Location:** `resumeController.js:8-20`
```javascript
Resume.find({ user: req.user._id })  // Only user's resumes
.sort({ updatedAt: -1 })             // Newest first
```

#### Get Specific Resume
**Location:** `resumeController.js:27-45`
```javascript
Resume.findOne({ 
  _id: req.params.id, 
  user: req.user._id  // Security: ensure user owns resume
})
```

#### Create Resume
**Location:** `resumeController.js:52-77`
```javascript
Resume.create({
  user: req.user._id,
  data,                    // Resume JSON structure
  title: title || 'Untitled Resume'
})
```

#### Update Resume
**Location:** `resumeController.js:84-110`
```javascript
Resume.findOne({ _id, user })  // Security check
resume.data = data
resume.title = title
resume.save()
```

#### Delete Resume
**Location:** `resumeController.js:117-135`
```javascript
Resume.findOneAndDelete({
  _id: req.params.id,
  user: req.user._id  // Security: only owner can delete
})
```

---

### 5. Routes

#### Auth Routes (`routes/authRoutes.js`)
```
POST   /api/auth/register          → Public, validate input
POST   /api/auth/verify-otp        → Public, validate OTP
POST   /api/auth/login             → Public, validate credentials
POST   /api/auth/refresh           → Public, validate cookie
POST   /api/auth/forgot-password   → Public, validate email
POST   /api/auth/reset-password    → Public, validate email + OTP + password
POST   /api/auth/resend-otp        → Public, validate email + purpose
POST   /api/auth/logout            → Protected, need token
GET    /api/auth/me                → Protected, need token
```

#### Resume Routes (`routes/resumeRoutes.js`)
```
All routes protected with router.use(protect)

GET    /api/resumes                → Get all user's resumes
GET    /api/resumes/:id            → Get specific resume
POST   /api/resumes                → Create new resume
PUT    /api/resumes/:id            → Update resume
DELETE /api/resumes/:id            → Delete resume
```

---

### 6. Validation (`utils/validators.js`)

Uses **Joi** library for schema validation.

**Example:** Register Schema (Lines 3-18)
```javascript
{
  name: String (2-50 chars, required),
  email: String (valid email format, required),
  password: String (6-128 chars, required)
}
```

**Validation happens in middleware** (`middleware/auth.js:55-68`)
```javascript
If any field fails validation:
  → Return 400 with error messages
  → Don't proceed to controller
```

---

### 7. Error Handler (`middleware/errorHandler.js`)

**Catches these errors:**
- **Duplicate Key Error (11000)** → 400
  ```
  Email already exists → "Email already exists"
  ```

- **Validation Error** → 400
  ```
  Invalid data format → Returns all validation messages
  ```

- **Cast Error** → 400
  ```
  Invalid MongoDB ID → "Invalid ID format"
  ```

- **JWT Errors** → 401
  ```
  TokenExpiredError → "Token expired"
  JsonWebTokenError → "Invalid token"
  ```

- **Generic Error** → 500
  ```
  Anything else → "Internal Server Error"
  ```

**Development Mode:**
Includes full error stack trace in response (helps debugging)

**Production Mode:**
Only returns error message (doesn't expose sensitive info)

---

### 8. Email Service (`services/emailService.js`)

**Configuration:**
- SMTP: Gmail (or custom)
- Email fields from `.env`

**Fallback Behavior:**
- If email not configured in dev → Log OTP to console
- If email send fails → Still allow login, log OTP to console

**Email Template:**
- Beautiful HTML email with OTP displayed
- Different subject/message for verification vs password reset
- Includes expiry warning (10 minutes)

**Code Location:** `services/emailService.js:27-99`

---

### 9. Server Setup (`server.js`)

**Initialization Order:**
```
1. Load environment variables (dotenv)
2. Create Express app
3. Connect to MongoDB
4. Setup CORS middleware
5. Setup body parsers (JSON, URL-encoded)
6. Setup cookie parser
7. Setup rate limiter
8. Define routes
9. Setup 404 handler
10. Setup error handler
11. Start server
```

**Health Check Endpoint:** `server.js:51-59`
```
GET /api/health
→ Returns database connection status
→ Useful for monitoring
```

---

## API Endpoints

### Complete API Reference

#### Authentication Endpoints

**1. Register**
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "success": true,
  "message": "Account created! Please check your email for the verification OTP.",
  "data": { "email": "john@example.com" }
}
```

**2. Verify OTP**
```
POST /api/auth/verify-otp

Request:
{
  "email": "john@example.com",
  "otp": "123456"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully!",
  "data": {
    "user": { id, name, email, avatar, isVerified },
    "accessToken": "eyJhbGc..."
  }
}
```

**3. Login**
```
POST /api/auth/login

Request:
{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "success": true,
  "message": "Login successful!",
  "data": {
    "user": { id, name, email, avatar, isVerified },
    "accessToken": "eyJhbGc..."
  }
}
Cookie: refreshToken=<httpOnly>
```

**4. Refresh Access Token**
```
POST /api/auth/refresh
(Requires refreshToken cookie)

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

**5. Forgot Password**
```
POST /api/auth/forgot-password

Request:
{ "email": "john@example.com" }

Response (200):
{
  "success": true,
  "message": "If an account with that email exists, we've sent a password reset OTP."
}
```

**6. Reset Password**
```
POST /api/auth/reset-password

Request:
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newPassword456"
}

Response (200):
{
  "success": true,
  "message": "Password reset successfully!"
}
```

**7. Resend OTP**
```
POST /api/auth/resend-otp

Request:
{
  "email": "john@example.com",
  "purpose": "verification" | "password-reset"
}

Response (200):
{
  "success": true,
  "message": "A new OTP has been sent to your email."
}
```

**8. Logout**
```
POST /api/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

**9. Get Current User**
```
GET /api/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": {
    "user": { id, name, email, avatar, isVerified, createdAt }
  }
}
```

#### Resume Endpoints (All Protected - Require Authorization Header)

**1. Get All Resumes**
```
GET /api/resumes
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "count": 3,
  "data": [
    { _id, user, data, title, updatedAt, ... },
    ...
  ]
}
```

**2. Get Specific Resume**
```
GET /api/resumes/:resumeId
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "data": { _id, user, data, title, ... }
}
```

**3. Create Resume**
```
POST /api/resumes
Authorization: Bearer <accessToken>
Content-Type: application/json

Request:
{
  "title": "My Resume",
  "data": {
    "personalInfo": { ... },
    "experience": [ ... ],
    "education": [ ... ],
    "skills": [ ... ]
  }
}

Response (201):
{
  "success": true,
  "message": "Resume created successfully",
  "data": { _id, user, data, title, ... }
}
```

**4. Update Resume**
```
PUT /api/resumes/:resumeId
Authorization: Bearer <accessToken>

Request:
{
  "title": "Updated Title",
  "data": { ... }
}

Response (200):
{
  "success": true,
  "message": "Resume updated successfully",
  "data": { _id, user, data, title, ... }
}
```

**5. Delete Resume**
```
DELETE /api/resumes/:resumeId
Authorization: Bearer <accessToken>

Response (200):
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

---

## Security Features

### 1. **Password Security**
- ✅ Hashed with bcryptjs (12 rounds = 2^12 iterations)
- ✅ Never stored as plain text
- ✅ Never returned in API responses
- ✅ Minimum 6 characters (enforced)
- **Code:** `models/User.js:51-56`, `models/User.js:25`

### 2. **JWT Security**
- ✅ Access Token: Short-lived (15 minutes)
- ✅ Refresh Token: Long-lived (7 days), stored securely
- ✅ Tokens signed with secret key
- ✅ Token verification on protected routes
- **Code:** `utils/generateToken.js`, `middleware/auth.js`

### 3. **HTTP-Only Cookies**
- ✅ Refresh token stored in HTTP-only cookie (not accessible by JavaScript)
- ✅ Cannot be stolen by XSS attacks
- ✅ Automatically sent with requests
- **Code:** `authController.js:94-99`, `authController.js:259-264`

### 4. **Token Rotation**
- ✅ Old refresh token removed after use
- ✅ New refresh token issued
- ✅ Prevents token replay attacks
- **Code:** `authController.js:251-256`

### 5. **Token Reuse Detection**
- ✅ If old token is reused → All tokens revoked
- ✅ User must login again
- ✅ Detects compromised tokens
- **Code:** `authController.js:240-249`

### 6. **Email Verification**
- ✅ OTP sent to email before account activation
- ✅ OTP is hashed (never plain text in DB)
- ✅ OTP expires in 10 minutes
- ✅ Can be resent
- **Code:** `models/User.js:64-82`, `services/emailService.js`

### 7. **Password Reset Security**
- ✅ Requires email verification via OTP
- ✅ All sessions revoked after password reset
- ✅ Cannot reuse old refresh tokens
- **Code:** `authController.js:315-350`

### 8. **Rate Limiting**
- ✅ Max 100 auth requests per 15 minutes per IP
- ✅ Prevents brute force attacks
- ✅ Prevents OTP brute force
- **Code:** `server.js:39-48`

### 9. **CORS Protection**
- ✅ Only whitelisted origins allowed
- ✅ Prevents unauthorized cross-origin access
- ✅ Configurable via CLIENT_URL env
- **Code:** `server.js:19-32`

### 10. **Data Ownership Verification**
- ✅ Resume queries include `user: req.user._id`
- ✅ User cannot access other's resumes
- ✅ User cannot delete other's resumes
- **Code:** `resumeController.js:29`, `resumeController.js:88`

### 11. **Error Message Obfuscation**
- ✅ Forgot password doesn't reveal if email exists
- ✅ Prevents user enumeration attacks
- **Code:** `authController.js:288-293`

### 12. **OTP Purpose Verification**
- ✅ Verification OTP can't be used for password reset
- ✅ Each OTP has specific purpose attached
- **Code:** `models/User.js:77-82`, `authController.js:72`

---

## Common Interview Questions & Answers

### Authentication & JWT

#### Q1: Explain the complete authentication flow in your project

**Answer:**
"The authentication is a multi-step process:

1. **Registration**: User provides name, email, password. Backend hashes password and generates 6-digit OTP, sends to email.

2. **Email Verification**: User enters OTP from email. Backend verifies OTP (checks hash match, expiry, purpose). Upon success, marks user as verified.

3. **Login**: User enters email and password. Backend finds user, compares password hash, checks verification status. If all valid, generates two tokens:
   - Access Token (15 minutes) - for API requests
   - Refresh Token (7 days) - stored in secure HTTP-only cookie

4. **Protected Requests**: For any API call, client sends JWT in Authorization header. Backend middleware verifies signature and expiry.

5. **Token Refresh**: When access token expires, client uses refresh token cookie to request new access token. Old token is deleted, new one issued (token rotation).

6. **Logout**: User clicks logout. Backend removes refresh token from storage, clears cookie.

For security:
- Passwords and OTPs are hashed, never plain text
- Refresh tokens stored in HTTP-only cookies (XSS protection)
- Token reuse detected (clears all tokens if detected)
- Rate limiting prevents brute force"

**Code References:**
- Registration: `authController.js:10-53`
- Verify OTP: `authController.js:60-118`
- Login: `authController.js:125-202`
- Token generation: `utils/generateToken.js:6-19`
- JWT verification: `middleware/auth.js:7-50`
- Token refresh: `authController.js:209-275`

---

#### Q2: Why use JWT instead of session-based authentication?

**Answer:**
"JWT has several advantages:

**1. Stateless**: Server doesn't store session data. No database lookup needed for every request. Scales better.

**2. Scalable**: Works across multiple servers/microservices. Session-based would need shared session store.

**3. Mobile-friendly**: Mobile apps can easily store and send JWT.

**4. Microservices**: Each service can verify JWT independently using shared secret.

**Comparison:**
```
SESSION-BASED:
Client → Server stores session data → Client gets session ID in cookie
Client → Sends session ID → Server looks up in DB → Verify

JWT:
Client → Server creates signed token → Client stores token
Client → Sends token → Server verifies signature (no DB lookup needed!)
```

However, JWT has trade-offs:
- Cannot revoke immediately (token valid until expiry)
- Larger payload size
- Solution: Short-lived access tokens + refresh tokens"

**Code Evidence:**
- Short access token: `utils/generateToken.js:6-9` (15m expiry)
- Long refresh token: `utils/generateToken.js:15-18` (7d expiry)
- Stateless verification: `middleware/auth.js:24`

---

#### Q3: What is token rotation and why implement it?

**Answer:**
"Token rotation is replacing old tokens with new ones after each use.

**How it works:**
```
User logs in → Get AccessToken + RefreshToken
Access token expires → Use RefreshToken to get new AccessToken + new RefreshToken
Old RefreshToken deleted → New RefreshToken stored
```

**Why implement it?**

1. **Limits damage if token compromised**: If old token leaked, attacker can't use it (deleted after rotation)

2. **Detects compromised tokens**: If someone tries to reuse old token → We know it's compromised → Revoke all tokens

3. **Continuous renewal**: New tokens have fresh expiry times

**Real scenario:**
```
Day 1: User logs in, gets tokens
Day 3: User logs in from new device, old refresh token deleted
Day 5: Attacker finds old refresh token, tries to use it
       → Doesn't exist in our DB → All user's tokens revoked → User must login again
```"

**Code:**
- Token rotation: `authController.js:251-256`
- Token reuse detection: `authController.js:240-249`

---

#### Q4: How do you prevent password brute force attacks?

**Answer:**
"Multiple layers of protection:

1. **Rate Limiting on Auth Routes**:
```javascript
Max 100 requests per 15 minutes per IP
If exceeded → 429 (Too Many Requests)
```
Prevents attacker from trying many passwords quickly.

2. **Strong Password Hashing**:
```javascript
bcrypt with 12 rounds of salting
Each password takes ~100ms to hash
100 login attempts = 10 seconds minimum
Slows down brute force significantly
```

3. **Failed Login Behavior**:
```javascript
Don't reveal if email exists or password wrong
Both return: 'Invalid email or password'
Prevents user enumeration
```

4. **Account Lockout** (Could add):
```
After 5 failed logins → Lock account for 15 minutes
Notify user of unusual activity
```

5. **Verification Requirement**:
```
Unverified accounts can't login
Even if password correct
Must have access to email
```"

**Code:**
- Rate limiting: `server.js:39-48`, `server.js:61`
- Password hashing: `models/User.js:51-56`
- Generic error messages: `authController.js:134-147`

---

#### Q5: How is OTP (One-Time Password) secured?

**Answer:**
"OTP has several security measures:

1. **Hashing**: OTP is never stored plain text
```javascript
Plain OTP (123456) → Generate from 100000-999999 range
Hash with bcryptjs → Store hashed version in DB
User enters OTP → Compare hash (not plain text)
```

2. **Short Expiry**: OTP expires in 10 minutes
```javascript
User must use it quickly
Old OTPs become invalid
Cannot be used days later
```

3. **Purpose Validation**: Each OTP has a purpose
```
Verification OTP: Only for email verification
Password-reset OTP: Only for password reset
Verification OTP cannot be used for password reset
```

4. **Rate Limiting**: Applied to all auth routes
```
Cannot send 1000 OTPs to same email
Cannot try 1000 OTP codes
```

5. **OTP Clearing**: Cleared after successful use
```javascript
After verification → OTP deleted from DB
Cannot reuse same OTP
```"

**Code:**
- Generate OTP: `models/User.js:64-74`
- Verify OTP: `models/User.js:77-82`
- Clear OTP: `models/User.js:85-87`
- OTP email: `services/emailService.js:27-99`
- Rate limiting: `server.js:39-48`

---

#### Q6: What happens if a user's refresh token is stolen?

**Answer:**
"Multiple mechanisms protect against this:

1. **HTTP-Only Cookie**: 
```
Stored in HTTP-only cookie (not accessible by JavaScript)
Cannot be stolen by XSS attacks
Automatically included in requests
```

2. **Token Rotation**:
```
Each refresh token used once
Immediately replaced with new token
Old token deleted from DB
If stolen token used after rotation → Mismatch detected
```

3. **Token Reuse Detection**:
```
If attacker tries to use old token
We check: Is token in user's token list?
If NO → Token reuse detected!
Action: Clear ALL user's tokens
Force user to login again
Attacker gets nothing
```

4. **Short Access Token**:
```
Access token valid only 15 minutes
Even if leaked, attacker has limited time window
```

5. **HTTPS in Production**:
```
Tokens transmitted over encrypted HTTPS
Cannot be intercepted in transit
```

**Example Scenario:**
```
Day 1: User gets RefreshToken123
Day 2: Attacker steals RefreshToken123
Day 3: User logs out (RefreshToken123 deleted)
Day 4: Attacker tries RefreshToken123
      → Not in user's token list → Reuse detected!
      → All tokens revoked → Attacker logged out
      → Original user must login again
```"

**Code:**
- HTTP-only cookies: `authController.js:94-99`
- Token reuse detection: `authController.js:240-249`
- Token rotation: `authController.js:251-256`
- Token clearing on reset: `authController.js:338`

---

### Database & Data

#### Q7: Why use MongoDB and how is it beneficial?

**Answer:**
"MongoDB is a NoSQL document database. Why it's used here:

1. **Flexible Schema**:
```
Resume data varies per user
One user might have lots of projects
Another might have few
Flexible 'data' field accommodates both
```

2. **Document Storage**:
```
Resume is a complex nested structure
MongoDB stores as JSON-like document
No need for multiple tables
```

3. **Developer-Friendly**:
```
Data looks like JavaScript objects
Easy mapping with Mongoose
Less boilerplate than SQL
```

4. **Scalability**:
```
Designed for distributed systems
Can handle millions of documents
Automatic replication
```

**Trade-offs:**
```
SQL: Better for structured data, complex joins
MongoDB: Better for flexible schema, rapid development
```

**In this project**:
```
User → Multiple Resumes
Perfect for NoSQL
No rigid schema needed
Resume structure can evolve
```"

**Code:**
- MongoDB connection: `config/db.js`
- Mongoose setup: `server.js:6`, `models/User.js:1`
- Flexible data: `models/Resume.js:10-12`

---

#### Q8: Explain the relationship between User and Resume models

**Answer:**
"It's a One-to-Many relationship:
```
One User → Many Resumes
One Resume → One User
```

**Implementation**:
```javascript
Resume has: user: mongoose.Schema.Types.ObjectId (ref: 'User')
This references the User's _id

When querying resumes: Resume.find({ user: userId })
Mongoose automatically links to User
```

**Why this design?**
```
User has personal account
Can create multiple resume versions
Each resume belongs to exactly one user
No other user can access
```

**Query Examples**:
```javascript
Get all resumes for user:
  Resume.find({ user: userId })

Get specific resume (verify ownership):
  Resume.findOne({ _id: resumeId, user: userId })
  If user doesn't own it → null → 404
```

**Index**:
```javascript
resumeSchema.index({ user: 1 })
Speeds up queries by user
Essential for performance
```"

**Code:**
- Resume schema: `models/Resume.js`
- Index: `models/Resume.js:29`
- Ownership verification: `resumeController.js:29`, `resumeController.js:88`

---

#### Q9: How do you ensure users can only access their own resumes?

**Answer:**
"Every resume query includes user ownership check:

```javascript
// ❌ WRONG - Anyone could query any resume
Resume.findById(resumeId)

// ✅ CORRECT - Only user's own resume
Resume.findOne({
  _id: resumeId,
  user: req.user._id
})
// If user doesn't own it → Returns null → 404
```

**Applied to all operations**:
```
GET /api/resumes → Filters only user's resumes
GET /api/resumes/:id → Checks ownership
PUT /api/resumes/:id → Checks ownership
DELETE /api/resumes/:id → Checks ownership
```

**Middleware adds user to request**:
```javascript
// auth.js
const user = await User.findById(decoded.userId)
req.user = user
// Now controller has req.user._id

// resumeController.js
Resume.find({ user: req.user._id })
```

**Security principle**: Never trust user input for ID. Always verify ownership using authenticated user data."

**Code:**
- Auth middleware adds user: `middleware/auth.js:35`
- Resume queries with user filter: `resumeController.js:10`, `resumeController.js:29`, `resumeController.js:88`

---

### Error Handling & Validation

#### Q10: How do you validate user input?

**Answer:**
"Input validation happens in two places:

1. **Joi Schema Validation**:
```javascript
// validators.js
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).max(128).required()
})
```

2. **Validation Middleware**:
```javascript
// Executes before controller
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        success: false,
        message: messages[0],
        errors: messages
      })
    }
    next()
  }
}
```

3. **Mongoose Schema Validation**:
```javascript
// models/User.js
name: {
  required: [true, 'Name is required'],
  minlength: [2, 'Min 2 chars'],
  maxlength: [50, 'Max 50 chars']
}
```

**Applied in routes**:
```javascript
router.post('/register', validate(registerSchema), register)
// Validates before reaching controller
```

**Error Response**:
```json
{
  \"success\": false,
  \"message\": \"Name must be at least 2 characters\",
  \"errors\": [\"Name must be at least 2 characters\", ...]
}
```"

**Code:**
- Joi schemas: `utils/validators.js`
- Validation middleware: `middleware/auth.js:55-68`
- Routes with validation: `routes/authRoutes.js:26-32`
- Mongoose validation: `models/User.js:4-26`

---

#### Q11: How does error handling work?

**Answer:**
"Error handling is centralized in middleware:

```javascript
// errorHandler.js
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message = err.message

  // Handle different error types
  if (err.code === 11000) {  // Duplicate key
    statusCode = 400
    message = 'Email already exists'
  }
  if (err.name === 'ValidationError') {  // Mongoose
    statusCode = 400
    message = 'Validation failed'
  }
  if (err.name === 'CastError') {  // Invalid ID
    statusCode = 400
    message = 'Invalid ID format'
  }
  if (err.name === 'JsonWebTokenError') {  // JWT
    statusCode = 401
    message = 'Invalid token'
  }
  if (err.name === 'TokenExpiredError') {  // Expired JWT
    statusCode = 401
    message = 'Token expired'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack })
  })
}
```

**Usage in controllers**:
```javascript
try {
  // Business logic
} catch (error) {
  next(error)  // Pass to error handler
}
```

**Advantages**:
```
✓ Centralized error handling
✓ Consistent error responses
✓ No error handling in every controller
✓ Stack traces in dev only (security)
✓ Can add logging later (one place)
```"

**Code:**
- Error handler: `middleware/errorHandler.js`
- Error flow: `authController.js:50-52`

---

### Architecture & Design

#### Q12: What design patterns are used in this backend?

**Answer:**
"Several design patterns are implemented:

1. **MVC (Model-View-Controller)**:
```
Models: models/User.js, models/Resume.js
Views: JSON responses (API)
Controllers: controllers/authController.js, resumeController.js
```

2. **Middleware Pattern**:
```
Request → Middleware1 → Middleware2 → Route Handler → Response
Applied for validation, auth, error handling
```

3. **Factory Pattern**:
```
Email transporter creation: createTransporter()
Creates different transporters based on config
```

4. **Strategy Pattern**:
```
OTP can be used for 'verification' or 'password-reset'
Different handling based on purpose
```

5. **Repository Pattern** (Implicit):
```
Controllers interact through models
Models handle all DB queries
Separation of concerns
```

6. **Dependency Injection**:
```
Middleware adds user to request
Controller receives pre-processed data
Loose coupling
```"

**Code Examples:**
- MVC structure: Project directory layout
- Middleware: `server.js:18-73`
- Email factory: `services/emailService.js:7-21`
- Auth strategy: `authController.js:72`, `authController.js:327`

---

#### Q13: How is code organized in this project?

**Answer:**
"The project follows a modular architecture:

```
LAYERS:
1. Routes (Entry point)
   ↓
2. Middleware (Validation, Auth, Error)
   ↓
3. Controllers (Business logic)
   ↓
4. Models (Data layer)
   ↓
5. Services (Email, Utilities)
```

**Each layer has single responsibility**:
```
Routes: Just define endpoints
Middleware: Just validate or protect
Controllers: Just orchestrate logic
Models: Just define schema and DB operations
Services: Just send emails, generate tokens
```

**File structure makes it easy to**:
```
✓ Find code: Know where each concern lives
✓ Test: Each layer independently testable
✓ Scale: Add new features without touching old code
✓ Debug: Trace request through layers
```

**Example: User Registration Flow**
```
routes/authRoutes.js (POST /register)
  ↓ validate(registerSchema)
middleware/auth.js
  ↓ register()
controllers/authController.js
  ↓ new User(...)
models/User.js
  ↓ await sendOTPEmail()
services/emailService.js
```"

**Code:**
- Routes: `routes/authRoutes.js`, `routes/resumeRoutes.js`
- Middleware: `middleware/auth.js`, `middleware/errorHandler.js`
- Controllers: `controllers/authController.js`, `controllers/resumeController.js`
- Models: `models/User.js`, `models/Resume.js`
- Services: `services/emailService.js`

---

### Performance & Scaling

#### Q14: How does this backend scale to handle more users?

**Answer:**
"Several techniques ensure scalability:

1. **Database Indexing**:
```javascript
// Resume queries by user are fast
resumeSchema.index({ user: 1 })

// Prevents full collection scans
// O(1) instead of O(n) for user lookups
```

2. **Stateless Authentication**:
```
JWT validation doesn't need session store
No database hits for every request
Can run multiple server instances
```

3. **Connection Pooling**:
```
MongoDB maintains connection pool
Reuses connections instead of creating new ones
Default: 100 connections
```

4. **Rate Limiting**:
```
Prevents traffic spikes from overwhelming server
Protects against DoS attacks
```

5. **Async/Await Pattern**:
```
Non-blocking I/O operations
Can handle thousands of concurrent requests
Doesn't block on database operations
```

**To scale further**:
```
✓ Use CDN for static content
✓ Cache frequently accessed data (Redis)
✓ Database sharding (partition by userId)
✓ Load balancer (distribute traffic)
✓ Message queue (async email sending)
✓ Replica set (database redundancy)
```"

**Code Evidence:**
- Connection pooling: `config/db.js` (Mongoose uses by default)
- Async operations: `authController.js:10` (async/await)
- Indexing: `models/Resume.js:29`
- Rate limiting: `server.js:39-48`

---

#### Q15: How would you handle high volume of email sending?

**Answer:**
"Current implementation has fallback but isn't optimized for scale:

**Current (Development)**:
```
User registers → OTP generated → Email sent immediately
If email fails → Logged to console, still allows login
```

**For production with high volume**:

1. **Message Queue** (Recommended):
```javascript
Use Redis Queue or BullMQ
User registers → OTP generated → Queue email job → Response
Separate worker process sends emails
If email service down → Job retried later
```

2. **Async Email Sending**:
```javascript
// Instead of await
await sendOTPEmail(email, otp)

// Use background job
emailQueue.add({email, otp})
// Continue immediately, don't wait
```

3. **Email Service Provider**:
```
Use SendGrid, AWS SES, or Mailgun
More reliable than personal Gmail
Built-in retry logic
Tracking and analytics
```

4. **Template Caching**:
```javascript
Store email template, not generate each time
Reduces processing overhead
```

5. **Batch Sending**:
```javascript
Collect emails, send in batches
More efficient than one-by-one
```"

**Current Code:**
- Email service: `services/emailService.js`
- How it's called: `authController.js:43`
- Improvement needed: Make async with queue system

---

### Security Deep Dives

#### Q16: What OWASP vulnerabilities are prevented in this project?

**Answer:**
"Several top OWASP vulnerabilities are mitigated:

**A01: Broken Authentication** ❌ PREVENTED
```
✓ Strong password hashing (bcrypt)
✓ JWT tokens with expiry
✓ Token rotation
✓ Token reuse detection
✓ Email verification required
```

**A02: Broken Access Control** ❌ PREVENTED
```
✓ Every resume query includes user ID check
✓ Cannot access other's resumes
✓ Cannot modify other's data
Code: resumeController.js:29, 88
```

**A03: Injection** ❌ PREVENTED
```
✓ Using Mongoose (parameterized queries)
✓ No string concatenation in queries
✓ Input validation with Joi
Code: utils/validators.js
```

**A04: Insecure Design** ❌ PREVENTED
```
✓ Rate limiting prevents brute force
✓ OTP with expiry prevents guessing
✓ Generic error messages (no user enumeration)
Code: server.js:39-48, errorHandler.js
```

**A05: Broken Validation** ❌ PREVENTED
```
✓ Joi validation on all inputs
✓ Mongoose schema validation
Code: utils/validators.js, models/User.js
```

**A07: Identification/Authentication Failures** ❌ PREVENTED
```
✓ Email verification required
✓ OTP-based verification
✓ Failed login limits via rate limiting
Code: authController.js:151-164
```

**A08: Software/Data Integrity Failures** ❌ PREVENTED
```
✓ No untrusted dependencies auto-updated
✓ dotenv for secrets (not in code)
✓ CORS whitelisting
Code: server.js:19-32
```

**Not explicitly addressed (Future)**:
```
A06: Cryptographic Failures → Use HTTPS in prod
A09: Logging/Monitoring → Add request logging
A10: SSRF → Not applicable (no external requests)
```"

---

#### Q17: How do you protect against XSS attacks?

**Answer:**
"XSS (Cross-Site Scripting) attacks inject malicious scripts into the page.

**Protections in place**:

1. **HTTP-Only Cookies**:
```javascript
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,  // ← JavaScript CANNOT access
  secure: true,    // ← Only over HTTPS
  sameSite: 'strict'
})
```
Prevents JavaScript from stealing tokens.

2. **Input Validation**:
```javascript
Name validated with Joi
Email validated with email regex
Cannot inject HTML/scripts through input
Code: utils/validators.js
```

3. **API Response**:
```json
{
  \"success\": true,
  \"data\": { \"name\": \"<script>alert('xss')</script>\" }
}
```
Frontend must render safely (e.g., React escapes by default)

4. **No Direct HTML Return**:
```
Backend returns JSON, not HTML
No server-side template injection possible
Frontend (React/Vue) responsible for safe rendering
```

**Frontend responsibility** (not backend):
```javascript
// Safe in React
<h1>{userName}</h1>  // Automatically escaped

// NOT Safe
<h1 dangerouslySetInnerHTML={{__html: userName}} />
```

**Note**: Backend + Frontend = Complete XSS protection"

---

#### Q18: How do you prevent SQL injection (even though using NoSQL)?

**Answer:**
"SQL Injection isn't directly applicable to MongoDB, but similar attacks exist.

**Protections**:

1. **Using Mongoose**:
```javascript
// ✓ Safe - Mongoose parameterizes
User.findOne({ email: userEmail })

// ❌ Wrong - String concatenation (if we did this)
User.findOne({ email: db.query(`SELECT * WHERE email='${userEmail}'`) })
```

2. **Query Operators**:
```javascript
// ✓ Safe
Resume.find({ user: userId })

// ❌ Wrong (NoSQL injection)
Resume.find({ user: {$ne: null} })  // If userId was not validated
```

3. **Input Validation**:
```javascript
// All inputs validated with Joi
// Invalid data rejected before reaching DB
email: Joi.string().email().required()
// Only valid emails reach DB query
```

4. **Schema Validation**:
```javascript
// Mongoose enforces types
user: {
  type: mongoose.Schema.Types.ObjectId,
  required: true
}
// Can't inject non-ObjectId values
```

**Real-world protection principle**:
```
Never trust user input
Always validate before DB query
Use parameterized queries (Mongoose does this)
Use schema validation
```"

---

### Testing & Debugging

#### Q19: How would you test this backend?

**Answer:**
"Testing strategy for this backend:

**1. Unit Tests** (Test individual functions)
```javascript
// Test password comparison
const user = new User({password: 'test123'})
await user.save()
const isMatch = await user.comparePassword('test123')
expect(isMatch).toBe(true)

// Test OTP generation
const otp = await user.generateOTP('verification')
expect(otp).toHaveLength(6)
expect(user.otp.expiresAt).toBeGreaterThan(Date.now())
```

**2. Integration Tests** (Test complete flows)
```javascript
// Test registration + verification flow
POST /api/auth/register
→ POST /api/auth/verify-otp
→ Verify user is marked verified

POST /api/auth/login
→ POST /api/resumes (create resume)
→ GET /api/resumes (retrieve resume)
→ Verify resume belongs to user
```

**3. API Tests** (Test endpoints)
```javascript
Test all endpoints with:
✓ Valid input → Should succeed
✓ Invalid input → Should return 400
✓ Missing auth → Should return 401
✓ Wrong user's resource → Should return 404
```

**4. Security Tests**
```javascript
✓ Rate limiting works
✓ Cannot access other's resume
✓ Token expiry works
✓ Password hashing verified
✓ SQL injection prevention
```

**Tools to use**:
```
Jest → Unit testing
Supertest → API testing
Postman → Manual testing
```"

---

#### Q20: How do you debug issues in production?

**Answer:**
"Debugging production without exposing sensitive data:

**1. Logging**:
```javascript
// Current - Basic logging
console.log(`Login attempt: ${email}`)

// Better - Structured logging
{
  timestamp: '2026-05-10T10:30:00Z',
  level: 'INFO',
  event: 'login_attempt',
  userId: '507f1f77bcf86cd799439011',  // ID, not email
  status: 'success'
}
```

**2. Error Tracking**:
```javascript
// Use service like Sentry, DataDog
catch (error) {
  Sentry.captureException(error)
  next(error)
}
```

**3. Environment-specific responses**:
```javascript
// Development: Full error stack
if (NODE_ENV === 'development') {
  res.json({ success: false, message, stack: error.stack })
}

// Production: Generic message
else {
  res.json({ success: false, message })
}
```

**4. Request/Response logging**:
```javascript
// Log all requests (centralized)
app.use((req, res, next) => {
  console.log(`${new Date()} ${req.method} ${req.url}`)
  next()
})
```

**5. Database monitoring**:
```
Monitor MongoDB:
- Slow queries
- Connection count
- Memory usage
- Replication lag
```

**6. Metrics monitoring**:
```
Watch:
- Request rate
- Error rate
- Response time
- CPU/Memory usage
```"

---

## Environment Variables (.env)

**Required variables:**
```
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# JWT Secrets
JWT_ACCESS_SECRET=your_super_secret_access_key_123
JWT_REFRESH_SECRET=your_super_secret_refresh_key_456

# Token Expiry
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:5173,http://localhost:3000

# Email (Optional in dev)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@resumebuilder.com
```

---

## Common Issues & Solutions

### Issue 1: "Token expired" on every request

**Problem**: Access token expires too quickly

**Solution**: 
- Check JWT_ACCESS_EXPIRY in .env
- Should be something reasonable like "15m"
- Not "1s" or "10s"

---

### Issue 2: CORS error when calling API

**Problem**: Frontend can't access backend

**Solution**:
```
Check CLIENT_URL in .env
Should include frontend domain
CLIENT_URL=http://localhost:5173
Not just http://localhost
```

---

### Issue 3: OTP not sending

**Problem**: Email not configured

**Solution**:
- In development: OTP logs to console
- In production: Configure EMAIL variables
- Use real email service (Gmail, SendGrid)

---

### Issue 4: "Cannot read property '_id' of undefined"

**Problem**: req.user is undefined

**Solution**:
```
Route not protected
Missing 'protect' middleware
Add: router.use(protect) or protect on specific routes
```

---

## Summary for Interview

### Key Points to Emphasize

1. **Security First**:
   - Password hashing with bcrypt
   - JWT with token rotation
   - HTTP-only cookies for refresh tokens
   - Email verification required
   - Rate limiting against brute force

2. **Clean Architecture**:
   - MVC pattern (Models, Controllers, Routes)
   - Separation of concerns
   - Middleware for cross-cutting concerns
   - Reusable validation

3. **Production Ready**:
   - Error handling (centralized)
   - Validation (input + schema)
   - CORS protection
   - Environment variables
   - Async operations

4. **Scalable Design**:
   - Stateless JWT authentication
   - Database indexing
   - Modular code structure
   - Separation of services

5. **User Experience**:
   - Email verification for account safety
   - Forgot password flow
   - Multi-device support (multiple refresh tokens)
   - Token rotation for seamless experience

---

## Additional Resources

**To understand more**:
- JWT: https://jwt.io
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- Mongoose: https://mongoosejs.com
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Last Updated**: May 10, 2026

This documentation covers everything from beginner-level explanations to advanced security concepts. Use this to prepare for interviews and explain your project confidently!
