# Resume Builder - Project Architecture & Technical Concepts

This document provides a detailed explanation of the core technical concepts, architectural patterns, and security features implemented in the Resume Builder project.

---

## 1. Project Architecture (Frontend + Backend Flow)
The project follows a **Client-Server Architecture** using a decoupled approach with a clear separation of concerns.

- **Monorepo-like Structure**: Both frontend and backend reside in the same repository for ease of development but are deployed independently.
- **Data Flow**: 
    1. The React frontend captures user input in real-time.
    2. Data is managed via Context API and synced to `localStorage`.
    3. The frontend communicates with the Node.js/Express backend via REST APIs (Axios).
    4. The backend validates requests and persists data in MongoDB.
- **File Reference**: 
    - [frontend/](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend) (Client-side code)
    - [backend/](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend) (Server-side code)

---

## 2. React.js & Component-Based Architecture
The frontend is built with **Vite + React**, utilizing a modular component-based architecture.

- **Atomic Design**: UI is broken down into reusable components (Buttons, Inputs, Modals) and complex page-level components (Editor, Dashboard).
- **Styling**: Uses **Tailwind CSS** for responsive, utility-first styling.
- **File Reference**: 
    - [frontend/src/components/](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/components)
    - [frontend/src/pages/Editor.jsx](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/pages/Editor.jsx)

---

## 3. React Hooks & Context API
State management is handled using React's native **Context API** and **Custom Hooks**, avoiding the overhead of Redux for this scale.

- **AuthContext**: Manages user authentication state (login, logout, user profile).
- **ResumeContext**: Manages the complex resume data state and syncing logic.
- **File Reference**: 
    - [frontend/src/context/AuthContext.jsx](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/context/AuthContext.jsx)
    - [frontend/src/context/ResumeContext.jsx](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/context/ResumeContext.jsx)

---

## 4. Routing & Protected Routes
**React Router DOM v6** is used for client-side navigation.

- **Protected Routes**: Wrappers that check the `isAuthenticated` state from `AuthContext`. If false, users are redirected to `/login`.
- **Guest Routes**: Prevent logged-in users from accessing login/register pages.
- **File Reference**: 
    - [frontend/src/App.jsx](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/App.jsx) (See `ProtectedRoute` and `GuestRoute` components)

---

## 5. Real-Time Preview + Auto-Save Debouncing
The application provides an "as-you-type" experience while optimizing network traffic.

- **Real-Time Preview**: The `resumeData` in `ResumeContext` is updated on every keystroke, causing the Preview component to re-render instantly.
- **Debounced Sync**: Instead of hitting the API on every keystroke, a `setTimeout` (2000ms) is used to batch updates. If the user types again within 2s, the previous timer is cleared (`clearTimeout`).
- **File Reference**: 
    - [frontend/src/context/ResumeContext.jsx](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/context/ResumeContext.jsx) (Lines 107-119)

---

## 6. Axios + REST API Integration
All HTTP requests are centralized in a service layer using **Axios**.

- **Interceptors**: Axios interceptors are used to automatically attach the JWT `AccessToken` to every request.
- **Error Handling**: Centralized handling for 401 (Expired Token) errors to trigger the refresh token flow.
- **File Reference**: 
    - [frontend/src/services/api.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/frontend/src/services/api.js)

---

## 7. Node.js + Express.js Backend
A robust RESTful API built with **Express.js**.

- **Middleware Pipeline**: Uses standard middleware like `cors`, `helmet` (security), `morgan` (logging), and custom error handlers.
- **Entry Point**: Configures database connection and routes.
- **File Reference**: 
    - [backend/server.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/server.js)

---

## 8. MongoDB + Mongoose + CRUD Operations
Data is stored in **MongoDB Atlas** using **Mongoose** for schema modeling.

- **Schemas**: Strict definitions for Users (Auth) and Resumes (Data structure).
- **CRUD**: Full implementation for creating, reading, updating, and deleting resumes.
- **File Reference**: 
    - [backend/models/Resume.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/models/Resume.js)
    - [backend/controllers/resumeController.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/controllers/resumeController.js)

---

## 9. JWT Authentication + Refresh Token Flow
The project implements a highly secure **Dual-Token System**.

- **Access Token**: Short-lived (e.g., 15m), stored in memory or local storage, used for API auth.
- **Refresh Token**: Long-lived (7 days), stored in an **HttpOnly Cookie** for security (prevents XSS access).
- **Token Rotation**: On every refresh, the old refresh token is invalidated and a new pair is issued.
- **Reuse Detection**: If an old refresh token is used, all sessions for that user are revoked for security.
- **File Reference**: 
    - [backend/controllers/authController.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/controllers/authController.js) (See `refreshAccessToken` function)
    - [backend/utils/generateToken.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/utils/generateToken.js)

---

## 10. Security Features
Security is baked into every layer of the application.

- **bcrypt**: Used to hash passwords before saving them to the database.
- **OTP (One-Time Password)**: Implemented for account verification and password resets.
- **Middleware Validation**: Uses **Joi** to validate incoming request bodies (schema enforcement).
- **Auth Middleware**: Protects private routes by verifying JWTs.
- **File Reference**: 
    - [backend/models/User.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/models/User.js) (Bcrypt logic)
    - [backend/middleware/auth.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/middleware/auth.js) (JWT verification & Joi validation)
    - [backend/controllers/authController.js](file:///c:/Users/hp/Documents/RESUME-BUILDER/backend/controllers/authController.js) (OTP generation & logic)
