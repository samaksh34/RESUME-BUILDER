# Resume Builder - Complete Frontend Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Core Technologies Explained](#core-technologies-explained)
5. [State Management](#state-management)
6. [Authentication Flow](#authentication-flow)
7. [Key Components](#key-components)
8. [Styling & Animations](#styling--animations)
9. [API Integration](#api-integration)
10. [Common Interview Questions](#common-interview-questions)

---

## Project Overview

**Resume Builder** is a full-featured web application that allows users to:
- Create, edit, and manage multiple resume versions
- Choose from different resume templates (ATS-optimized, etc.)
- Export resumes as PDF
- Authenticate securely with email/password
- Access a dashboard to view all resumes
- Enjoy light/dark mode themes

**Key Differentiators:**
- Real-time resume preview while editing
- Multiple resume management per user
- PDF export functionality
- Authentication with OTP verification
- Local storage + Backend sync
- Dark/Light theme support

---

## Tech Stack

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **React** | 18.3.1 | UI library for building interactive components |
| **React Router DOM** | 6.23.0 | Client-side routing and navigation |
| **Vite** | 5.3.1 | Fast build tool & dev server |
| **Tailwind CSS** | 3.4.4 | Utility-first CSS framework |
| **Axios** | 1.15.0 | HTTP client for API requests |
| **Framer Motion** | 11.2.0 | Animation library for smooth transitions |
| **GSAP** | 3.15.0 | Advanced animation library |
| **html2pdf.js** | 0.14.0 | PDF export functionality |
| **Lucide React** | 0.378.0 | Icon library with 400+ icons |
| **date-fns** | 4.1.0 | Date manipulation library |
| **clsx** | 2.1.1 | Utility for conditional classnames |
| **tailwind-merge** | 2.3.0 | Merge Tailwind CSS classes intelligently |

### Dev Dependencies

- **ESLint** - Code quality and linting
- **PostCSS** - CSS transformations
- **Autoprefixer** - Vendor prefixes for CSS
- **React Types** - TypeScript types for React

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── FormSection.jsx
│   │   ├── InputField.jsx
│   │   ├── ResumePreview.jsx
│   │   ├── ResumeCollage.jsx
│   │   ├── HistorySidebar.jsx
│   │   ├── EditorSidebar.jsx
│   │   ├── HorizontalSectionsNav.jsx
│   │   ├── ATSWarningsPanel.jsx
│   │   ├── SectionHeading.jsx
│   │   └── DotGrid.jsx
│   │
│   ├── context/             # React Context for state management
│   │   ├── AuthContext.jsx  # Authentication state
│   │   ├── ResumeContext.jsx # Resume data state
│   │   ├── ThemeContext.jsx  # Dark/Light theme state
│   │   └── ResumeContextObject.js
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useResumeData.js # Resume data hook
│   │
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Editor.jsx       # Main resume editor
│   │   ├── Dashboard.jsx    # User's resume list
│   │   ├── Templates.jsx    # Template showcase
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── VerifyOTP.jsx    # OTP verification
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── NotFound.jsx     # 404 page
│   │
│   ├── services/            # API service layer
│   │   └── api.js           # Axios instance with interceptors
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.js     # App-wide constants
│   │   └── helpers.js       # Helper functions
│   │
│   ├── data/                # Static data
│   │   └── sampleResume.json # Default resume template
│   │
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
│
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── index.html               # HTML template
└── package.json             # Dependencies
```

---

## Core Technologies Explained

### 1. React 18.3.1

**What is it?** A JavaScript library for building user interfaces with reusable components.

**Key Features Used in This Project:**
- **Functional Components** - Modern way to write React components
- **Hooks** - useState, useContext, useEffect, useRef, useCallback
- **Context API** - State management without prop drilling

**Example from the codebase:**
```jsx
// From ResumeContext.jsx
const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
        try {
            return createSafeResumeData(JSON.parse(saved));
        } catch (error) {
            return createSafeResumeData(null);
        }
    }
    return createSafeResumeData(null);
});
```

**Interview Relevance:**
- Demonstrate understanding of component lifecycle
- Show knowledge of hooks and their proper usage
- Explain why Context API was chosen over Redux

---

### 2. React Router DOM 6.23.0

**What is it?** Library for handling navigation and routing in single-page applications (SPAs).

**Key Features Used:**
- **Routes & Route** - Define URL paths and their components
- **Navigate** - Programmatic navigation
- **useLocation** - Get current URL location
- **Protected Routes** - Conditional rendering based on auth status

**Implementation in App.jsx:**
```jsx
<Router>
    <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        
        {/* Protected routes */}
        <Route path="/editor" element={
            <ProtectedRoute>
                <Editor />
            </ProtectedRoute>
        } />
        
        {/* Guest-only routes */}
        <Route path="/login" element={
            <GuestRoute>
                <Login />
            </GuestRoute>
        } />
    </Routes>
</Router>
```

**Key Concept - Protected Routes:**
```jsx
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    
    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return children;
};
```

---

### 3. Vite 5.3.1

**What is it?** A fast build tool that provides instant server start and lightning-fast HMR (Hot Module Replacement).

**Why Vite over Webpack?**
- 10-100x faster cold start
- Instant HMR updates
- Smaller bundle size
- Better development experience

**How it's used:**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
})
```

The `@vitejs/plugin-react` enables JSX compilation and Fast Refresh.

**Development Experience:**
```bash
npm run dev      # Starts dev server instantly
npm run build    # Optimized production build
npm run preview  # Preview production build locally
```

---

### 4. Tailwind CSS 3.4.4

**What is it?** A utility-first CSS framework that lets you build designs without leaving your HTML.

**How it Works:**
Instead of writing CSS classes, you use predefined utility classes directly in JSX:

```jsx
// Before (Traditional CSS)
<div className="my-component">
    <button>Save</button>
</div>

// After (Tailwind)
<div className="flex items-center justify-center gap-4 p-6 bg-white rounded-lg shadow-lg">
    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Save
    </button>
</div>
```

**Common Classes Used in This Project:**
- **Layout:** `flex`, `grid`, `gap`, `p-4`, `m-2`
- **Colors:** `bg-primary`, `text-white`, `border-gray-200`
- **Responsive:** `md:flex`, `lg:grid`, `sm:hidden`
- **States:** `hover:bg-blue-600`, `focus:outline-none`, `disabled:opacity-50`
- **Animations:** `animate-spin`, `transition-all`

**Dark Mode Implementation:**
```jsx
// In ThemeContext.jsx
useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}, [theme]);

// In tailwind.config.js
export default {
    darkMode: 'class',
    // ...
}

// Usage in components
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
    Content that changes based on theme
</div>
```

---

### 5. Axios 1.15.0

**What is it?** A promise-based HTTP client for making API requests.

**Why Axios over Fetch?**
- Automatic request/response interceptors
- Request timeout support
- Automatic JSON transformation
- Cancel request support
- Request/response transformation hooks

**Implementation Pattern:**
```jsx
// From services/api.js
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,  // Send cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Try to refresh token
            try {
                const { data } = await authAPI.refresh();
                localStorage.setItem('accessToken', data.data.accessToken);
                // Retry original request
            } catch {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
```

**API Service Methods:**
```jsx
export const resumeAPI = {
    getAll: () => api.get('/resumes'),
    getById: (id) => api.get(`/resumes/${id}`),
    create: (data) => api.post('/resumes', { data }),
    update: (id, data) => api.patch(`/resumes/${id}`, { data }),
    delete: (id) => api.delete(`/resumes/${id}`),
};

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
};
```

---

### 6. Framer Motion 11.2.0

**What is it?** A production-ready animation library for React with simple, declarative API.

**Benefits:**
- Hardware-accelerated animations
- Smooth transitions
- Gesture support
- Layout animations

**Example Use Cases in Resume Builder:**
```jsx
import { motion } from 'framer-motion';

// Fade in on mount
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
>
    Content
</motion.div>

// Slide in from left
<motion.aside
    initial={{ x: -300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
>
    Sidebar
</motion.aside>

// List animation with stagger
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
        staggerChildren: 0.1,
    }}
>
    {items.map((item) => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {item.name}
        </motion.div>
    ))}
</motion.div>
```

---

### 7. html2pdf.js 0.14.0

**What is it?** A library that converts HTML elements to PDF files.

**Usage Pattern:**
```jsx
import html2pdf from 'html2pdf.js';

const exportToPDF = () => {
    const element = document.getElementById('resume-preview');
    const options = {
        margin: 5,
        filename: 'my-resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
    };
    
    html2pdf().set(options).from(element).save();
};
```

---

### 8. Lucide React 0.378.0

**What is it?** A beautifully crafted icon library with 400+ consistent icons.

**Usage:**
```jsx
import { Download, Plus, Trash2, Save, Edit2 } from 'lucide-react';

export const MyComponent = () => (
    <div className="flex gap-2">
        <Download className="w-5 h-5" />
        <Plus className="w-5 h-5" />
        <Trash2 className="w-5 h-5 text-red-500" />
    </div>
);
```

**Advantages:**
- Consistent sizing and styling
- SVG-based (scalable)
- Can be colored with Tailwind classes
- Tree-shakeable (unused icons not bundled)

---

## State Management

### Context API Architecture

The project uses **React Context API** for state management, avoiding prop drilling while maintaining simplicity.

#### 1. AuthContext - Authentication State

**Purpose:** Manages user authentication, login/logout, and token refresh.

**Key State:**
```jsx
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);           // Current user object
    const [loading, setLoading] = useState(true);     // Auth check in progress
    
    // Derived state
    const isAuthenticated = !!user;                   // Boolean flag
};
```

**Provider Value:**
```jsx
value={{
    user,                           // { _id, email, name, ... }
    loading,                        // boolean
    isAuthenticated,               // boolean
    login,                         // async (email, password) => Promise
    register,                      // async (name, email, password) => Promise
    verifyOTP,                     // async (email, otp) => Promise
    forgotPassword,                // async (email) => Promise
    resetPassword,                 // async (email, otp, newPassword) => Promise
    resendOTP,                     // async (email, purpose) => Promise
    logout,                        // async () => Promise
    setUser,                       // function to update user directly
}}
```

**Auth Check on App Load:**
```jsx
useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const { data } = await authAPI.getMe();
            setUser(data.data.user);
        } catch {
            // Token invalid, try refresh
            try {
                const { data } = await authAPI.refresh();
                localStorage.setItem('accessToken', data.data.accessToken);
                const meRes = await authAPI.getMe();
                setUser(meRes.data.data.user);
            } catch {
                // Both failed, clear auth
                localStorage.removeItem('accessToken');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };
    
    checkAuth();
}, []);
```

---

#### 2. ResumeContext - Resume Data State

**Purpose:** Manages resume data across the application with localStorage persistence and backend sync.

**Key Features:**
- Local state with localStorage fallback
- Automatic backend sync (debounced)
- Safe data structure with fallbacks
- Multiple resume management

**Key State:**
```jsx
const [resumeData, setResumeData] = useState(/* ... */);     // Current resume content
const [activeResumeId, setActiveResumeId] = useState(null);  // Currently editing resume
const [activeResumeTitle, setActiveResumeTitle] = useState('Untitled Resume');
const [userResumes, setUserResumes] = useState([]);         // All user's resumes
const [isLoadingResumes, setIsLoadingResumes] = useState(false);

const saveTimeoutRef = useRef(null);                        // Debounce timer
```

**Resume Data Structure:**
```javascript
{
    personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        professionalSummary: "",
        portfolio: "",
    },
    education: [
        {
            id: "edu_1",
            schoolName: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            isCurrentlyStudying: false,
            description: "",
        }
    ],
    technicalSkills: [
        {
            id: "ts_1",
            category: "Languages",
            skills: "JavaScript, Python, Java"
        }
    ],
    internships: [
        {
            id: "int_1",
            companyName: "",
            position: "",
            startDate: "",
            endDate: "",
            isCurrentlyWorking: false,
            description: "",
        }
    ],
    projects: [
        {
            id: "proj_1",
            projectName: "",
            description: "",
            technologies: "",
            startDate: "",
            endDate: "",
            link: "",
        }
    ],
    achievements: [
        {
            id: "ach_1",
            title: "",
            date: "",
            description: "",
        }
    ],
    // ... more sections
}
```

**Debounced Save Pattern:**
```jsx
useEffect(() => {
    const safeData = createSafeResumeData(resumeData);
    localStorage.setItem('resumeData', JSON.stringify(safeData));
    
    if (activeResumeId) {
        // Clear existing timeout
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        // Debounce: wait 2 seconds after last change before saving to backend
        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await resumeAPI.update(activeResumeId, safeData);
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            } catch (error) {
                console.error('Save failed:', error);
            }
        }, 2000);
    }
    
    return () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
}, [resumeData, activeResumeId]);
```

---

#### 3. ThemeContext - Dark/Light Mode

**Purpose:** Manages application theme and persists preference.

**Implementation:**
```jsx
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'dark';  // Default to dark
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
```

---

## Authentication Flow

### Complete Auth Flow Diagram

```
App Load
    ↓
AuthProvider checks localStorage for accessToken
    ↓
If token exists:
    ├─ Try authAPI.getMe()
    │   ├─ Success → setUser(userData)
    │   └─ 401 TOKEN_EXPIRED → Axios interceptor handles refresh
    │
    └─ Token refresh:
        ├─ authAPI.refresh() (sends refresh token as cookie)
        │   ├─ Success → save new accessToken
        │   └─ Fail → clear auth, redirect to /login
        └─ Retry getMe()

If no token → User is not authenticated
```

### Login Flow

```
User clicks "Login"
    ↓
Login page form → authAPI.login(email, password)
    ↓
Axios request to /auth/login
    ↓
Backend returns { accessToken, user }
    ↓
localStorage.setItem('accessToken', token)
setUser(userData)
isAuthenticated = true
    ↓
Navigate to /editor (or intended page)
```

### Protected Routes Implementation

```jsx
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    // Show loading while auth is being checked
    if (loading) {
        return <LoadingSpinner />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // User is authenticated, show component
    return children;
};
```

### Guest Routes (Redirect if Logged In)

```jsx
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingSpinner />;
    }

    // If already logged in, redirect to editor
    if (isAuthenticated) {
        return <Navigate to="/editor" replace />;
    }

    return children;
};
```

---

## Key Components

### 1. ResumePreview Component

**Purpose:** Displays the resume in real-time as user edits.

**Key Features:**
- Template switching (ATS, Modern, etc.)
- Zoom in/out functionality
- Live preview synchronization
- PDF export integration

**Key Props:**
```jsx
<ResumePreview
    resumeData={resumeData}          // Current resume data
    template={'ats'}                 // Template name
    zoom={100}                       // Zoom percentage
/>
```

---

### 2. FormSection Component

**Purpose:** Reusable form section for editing resume sections (education, experience, etc.).

**Handles:**
- Adding new entries
- Editing existing entries
- Deleting entries
- Dynamic fields based on section type

**Usage:**
```jsx
<FormSection
    title="Education"
    icon={<GraduationCap />}
    items={resumeData.education}
    onAdd={() => addEducation()}
    onEdit={(id, data) => updateEducation(id, data)}
    onDelete={(id) => deleteEducation(id)}
    fields={[
        { name: 'schoolName', label: 'School Name' },
        { name: 'degree', label: 'Degree' },
        // ...
    ]}
/>
```

---

### 3. Editor Component

**Purpose:** Main resume editor page.

**Key Features:**
- Split view (form + preview)
- Template selection
- Zoom controls
- PDF export with modal
- Resume history/versioning
- Auto-save indicator

**Key State:**
```jsx
const [zoom, setZoom] = useState(100);           // Preview zoom level
const [template, setTemplate] = useState('ats');  // Selected template
const [exporting, setExporting] = useState(false);// Export in progress
const [showHistory, setShowHistory] = useState(false); // History panel
const [isSaving, setIsSaving] = useState(false);  // Auto-save status
```

---

### 4. Navbar Component

**Purpose:** Top navigation bar with theme toggle, user menu, and title.

**Features:**
- Dark/Light theme toggle
- User dropdown menu
- Resume title editing
- Navigation links

**Uses:**
- `useTheme()` hook for theme management
- `useContext(AuthContext)` for user info
- `useResumeData()` hook for title

---

### 5. Dashboard Component

**Purpose:** Shows user's all resumes and allows creating new ones.

**Key Features:**
- List all user resumes
- Create new resume
- Delete resume
- Open resume for editing
- Last modified timestamp

---

### 6. InputField Component

**Purpose:** Reusable text input field with consistent styling.

**Features:**
- Validation states (error, success)
- Placeholder support
- Label support
- Type variations (text, email, password, etc.)

**Usage:**
```jsx
<InputField
    label="Email Address"
    type="email"
    placeholder="john@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={emailError}
/>
```

---

## Styling & Animations

### Tailwind CSS Configuration

**Color Scheme:**
```javascript
// tailwind.config.js
colors: {
    primary: '#3B82F6',      // Blue
    secondary: '#8B5CF6',    // Purple
    background: '#FFFFFF',   // or #111827 in dark mode
    text: '#1F2937',         // or #F3F4F6 in dark mode
    // ...
}
```

**Responsive Breakpoints:**
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

**Example Responsive Component:**
```jsx
<div className="
    grid
    grid-cols-1              // 1 column on mobile
    md:grid-cols-2           // 2 columns on medium screens
    lg:grid-cols-3           // 3 columns on large screens
    gap-4
">
    {/* Items */}
</div>
```

### Animation Patterns

**Fade In:**
```jsx
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
>
    Content
</motion.div>
```

**Slide In:**
```jsx
<motion.div
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
>
    Content
</motion.div>
```

**Scale Up:**
```jsx
<motion.div
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3 }}
>
    Content
</motion.div>
```

**Staggered List:**
```jsx
<motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
        staggerChildren: 0.1,
        delayChildren: 0.2,
    }}
>
    {items.map((item) => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {item.name}
        </motion.div>
    ))}
</motion.div>
```

---

## API Integration

### Axios Configuration

**Base Setup:**
```javascript
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,           // Include cookies
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### Request Interceptor (Add Auth Token)

```javascript
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
```

**Purpose:** Every API request automatically includes the user's access token in the Authorization header.

### Response Interceptor (Token Refresh)

```javascript
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for expired token
        if (
            error.response?.status === 401 &&
            error.response?.data?.code === 'TOKEN_EXPIRED' &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                // Refresh the token
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const newToken = data.data.accessToken;
                localStorage.setItem('accessToken', newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, force logout
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
```

**Purpose:** When access token expires, automatically refresh it using the refresh token (in cookies) and retry the request.

### API Service Methods

```javascript
// Auth APIs
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    logout: () => api.post('/auth/logout'),
    refresh: () => api.post('/auth/refresh'),
    getMe: () => api.get('/auth/me'),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    resendOTP: (data) => api.post('/auth/resend-otp', data),
};

// Resume APIs
export const resumeAPI = {
    getAll: () => api.get('/resumes'),
    getById: (id) => api.get(`/resumes/${id}`),
    create: (data) => api.post('/resumes', { data }),
    update: (id, data) => api.patch(`/resumes/${id}`, { data }),
    delete: (id) => api.delete(`/resumes/${id}`),
    duplicate: (id) => api.post(`/resumes/${id}/duplicate`),
};
```

### Usage in Components

```jsx
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function LoginComponent() {
    const { login, user, isAuthenticated } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            // User is now logged in, navigate to editor
            navigate('/editor');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            {/* Form fields */}
        </form>
    );
}
```

---

## Common Interview Questions

### 1. **What is React and Why Use It?**

**Answer:**
React is a JavaScript library for building user interfaces using reusable components. In this Resume Builder project, we use React because:

- **Component Reusability** - FormSection, InputField, and Navbar are used across multiple pages
- **State Management** - Context API manages auth and resume data without prop drilling
- **Efficiency** - Virtual DOM and reconciliation make updates fast
- **Ecosystem** - Rich ecosystem with routing (React Router), animations (Framer Motion), and HTTP client (Axios)

**Code Example:**
```jsx
// Reusable FormSection component used across multiple sections
<FormSection
    title="Education"
    items={resumeData.education}
    onAdd={addEducation}
    onEdit={updateEducation}
    onDelete={deleteEducation}
/>
```

---

### 2. **Explain the Component Lifecycle and Hooks**

**Answer:**
Hooks allow functional components to use state and side effects. The Resume Builder uses:

**useState** - Manage local state:
```jsx
const [resumeData, setResumeData] = useState(initialData);
const [zoom, setZoom] = useState(100);
```

**useEffect** - Side effects (data fetching, subscriptions):
```jsx
// Fetch resumes when user logs in
useEffect(() => {
    if (isAuthenticated) {
        fetchUserResumes();
    }
}, [isAuthenticated]);

// Save to localStorage when data changes
useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
}, [resumeData]);
```

**useContext** - Access context values:
```jsx
const { user, isAuthenticated, logout } = useContext(AuthContext);
const { theme, toggleTheme } = useContext(ThemeContext);
```

**useRef** - Access DOM elements or keep mutable values:
```jsx
const resumeRef = useRef(null);  // Reference to resume element for PDF export
const saveTimeoutRef = useRef(null);  // Debounce timer
```

---

### 3. **What is React Router and Why Not Just Use Anchor Tags?**

**Answer:**
React Router enables Single Page Application (SPA) navigation without full page reloads. Benefits:

- **Client-Side Routing** - Navigation is instant, no server request
- **State Preservation** - App state (resume data, theme) persists across navigation
- **Protected Routes** - Conditionally render routes based on authentication
- **Browser History** - Back/forward buttons work correctly

**Implementation:**
```jsx
<BrowserRouter>
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/editor" element={
            <ProtectedRoute><Editor /></ProtectedRoute>
        } />
    </Routes>
</BrowserRouter>
```

**vs. Anchor Tags:**
```jsx
// ❌ Anchor tags cause full page reload, state is lost
<a href="/editor">Go to Editor</a>

// ✅ Router Link preserves state and prevents reload
<Link to="/editor">Go to Editor</Link>
```

---

### 4. **What is Context API? When Would You Use Redux?**

**Answer:**
Context API is React's built-in state management solution. We use it here because:

- **Simple Use Cases** - We have 3 contexts (Auth, Resume, Theme)
- **Minimal Boilerplate** - No actions, reducers, or store setup
- **Adequate Performance** - Resume Builder doesn't have 1000s of state updates/second

**When to Use Redux:**
- Very complex state logic
- Many actions and transformations
- Time-travel debugging needed
- Multiple independent state slices

**Our Context Structure:**
```jsx
// Provides authentication state globally
<AuthProvider>
    {/* Provides resume data globally */}
    <ResumeProvider>
        {/* Provides theme globally */}
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </ResumeProvider>
</AuthProvider>
```

---

### 5. **How Does Authentication Work? What's JWT and Token Refresh?**

**Answer:**
Our app uses JWT (JSON Web Token) based authentication:

**Flow:**
1. User logs in with email/password
2. Backend validates and returns **accessToken** (short-lived) and **refreshToken** (long-lived, in httpOnly cookie)
3. Client stores **accessToken** in localStorage
4. Every API request includes token: `Authorization: Bearer <token>`
5. When token expires (401), we use **refreshToken** to get a new **accessToken**

**Why Token Refresh?**
- **accessToken** is short-lived (5-15 min) for security
- If compromised, it's only valid briefly
- **refreshToken** is longer-lived but stored securely in httpOnly cookie
- User stays logged in without re-entering password

**Implementation:**
```jsx
// Request interceptor adds token
config.headers.Authorization = `Bearer ${token}`;

// Response interceptor handles 401
if (error.response?.status === 401) {
    try {
        const newToken = await authAPI.refresh();  // Uses cookie
        localStorage.setItem('accessToken', newToken);
        // Retry request with new token
    } catch {
        // Refresh failed, logout user
        window.location.href = '/login';
    }
}
```

---

### 6. **What is Tailwind CSS and Why Not Styled Components?**

**Answer:**
Tailwind is a **utility-first CSS framework**. We chose it because:

- **Consistency** - Pre-defined color palette, spacing, sizes
- **Performance** - Only unused classes are purged, smaller final bundle
- **Development Speed** - No context switching between JSX and CSS files
- **Dark Mode** - Built-in support with `dark:` prefix
- **Responsive Design** - Easy with `md:`, `lg:` prefixes

**Comparison:**
```jsx
// Styled Components - separate CSS logic
const Button = styled.button`
    background-color: #3B82F6;
    padding: 8px 16px;
    border-radius: 4px;
    &:hover { background-color: #2563EB; }
`;

// Tailwind - CSS in className
<button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
    Save
</button>

// Dark mode in Tailwind
<button className="bg-white dark:bg-gray-900 text-black dark:text-white">
    Save
</button>
```

---

### 7. **Explain Debouncing in the Resume Auto-Save**

**Answer:**
Debouncing delays action execution until the user stops performing the action. In Resume Builder, we debounce save operations:

```jsx
useEffect(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    
    if (activeResumeId) {
        // Clear previous timeout
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        // Wait 2 seconds after last change
        saveTimeoutRef.current = setTimeout(async () => {
            await resumeAPI.update(activeResumeId, resumeData);
        }, 2000);
    }
    
    return () => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
}, [resumeData, activeResumeId]);
```

**Why?**
- **Reduce Network Requests** - Don't save on every keystroke
- **Improve Performance** - Fewer API calls = faster UI
- **User Experience** - Show save indicator after user stops typing

**Timeline Example:**
```
User types "J" → Timer starts (0s)
User types "o" → Timer resets (0s)
User types "hn" → Timer resets (0s)
User stops typing → Timer reaches 2s → Save to backend
```

---

### 8. **How Do You Handle Errors in API Calls?**

**Answer:**
We handle errors at multiple levels:

**1. Axios Interceptor (Global):**
```jsx
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Try token refresh
        } else if (error.response?.status === 400) {
            // Validation error
        } else if (error.message === 'Network Error') {
            // No internet
        }
        return Promise.reject(error);
    }
);
```

**2. Component Level (Try-Catch):**
```jsx
const handleLogin = async () => {
    try {
        await login(email, password);
        navigate('/editor');
    } catch (error) {
        setErrorMessage(
            error.response?.data?.message || 'Login failed'
        );
    }
};
```

**3. Safe Defaults (Graceful Degradation):**
```jsx
// Resume data always has fallback structure
const createSafeResumeData = (data) => {
    const fallback = JSON.parse(JSON.stringify(sampleData));
    return { ...fallback, ...data };
};
```

---

### 9. **What is CSS-in-JS vs Utility-First CSS?**

**Answer:**
Two different approaches to styling:

**CSS-in-JS (Styled Components, Emotion):**
```jsx
const Button = styled.button`
    background-color: blue;
    padding: 8px;
    &:hover { background-color: darkblue; }
`;
```
- ✅ Scoped styles (no class name conflicts)
- ❌ Runtime overhead
- ❌ Larger bundle size

**Utility-First (Tailwind):**
```jsx
<button className="bg-blue-500 px-2 hover:bg-blue-700">Save</button>
```
- ✅ No runtime overhead (all at build time)
- ✅ Smaller bundle (unused classes removed)
- ✅ Consistency (pre-defined design system)
- ❌ Longer className strings

**Our Choice:** Tailwind is better for this project because we need fast, consistent styling.

---

### 10. **What is State Management and Why Not Just Prop Drilling?**

**Answer:**
**Prop Drilling** = passing props through multiple levels of components:
```jsx
<GrandParent user={user}>
    <Parent user={user}>
        <Child user={user} />
    </Parent>
</GrandParent>
```

Problems:
- Hard to refactor
- Props buried in middle components
- Harder to track data flow

**State Management (Context API):**
```jsx
<AuthProvider>  {/* Provides user */}
    <App>
        <GrandParent />
        <Parent />
        <Child />  {/* Can access user directly */}
    </App>
</AuthProvider>
```

Benefits:
- Direct access to global state
- Cleaner component props
- Easier to refactor
- Centralized updates

**In Resume Builder:**
- **AuthContext** - Instead of passing `user`, `isAuthenticated` through every component
- **ResumeContext** - Instead of passing `resumeData` through Editor → FormSection → InputField
- **ThemeContext** - Instead of passing theme through Navbar → ThemeToggle

---

### 11. **How Does PDF Export Work?**

**Answer:**
We use `html2pdf.js` library:

```jsx
import html2pdf from 'html2pdf.js';

const exportResumeToPDF = () => {
    const element = document.getElementById('resume-preview');
    const options = {
        margin: [5, 5, 5, 5],           // mm margins
        filename: `${resumeTitle}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },      // Better quality
        jsPDF: {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        },
    };
    
    html2pdf()
        .set(options)
        .from(element)
        .save();
};
```

**Flow:**
1. User clicks "Download PDF"
2. Get resume HTML element from DOM
3. Convert HTML → Canvas (html2canvas)
4. Convert Canvas → PDF (jsPDF)
5. Trigger browser download

---

### 12. **What's the Difference Between Controlled and Uncontrolled Components?**

**Answer:**
**Controlled Component** - React state controls the value:
```jsx
const [email, setEmail] = useState('');

<input
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
```
- ✅ React controls the input
- ✅ Easy validation and transformation
- ✅ Can set value programmatically
- ❌ More code

**Uncontrolled Component** - DOM controls the value:
```jsx
const emailRef = useRef(null);

<input ref={emailRef} />

// Access value when needed
const email = emailRef.current.value;
```
- ✅ Less code
- ❌ Harder to validate
- ❌ State not synchronized

**Our Project:** Uses **controlled components** for form inputs so we can:
- Validate before submit
- Clear fields after submit
- Display errors
- Show real-time preview

---

### 13. **Explain the Virtual DOM**

**Answer:**
React uses a **Virtual DOM** - an in-memory representation of the real DOM:

**Process:**
1. State changes in React component
2. React creates new Virtual DOM tree
3. React compares old Virtual DOM with new Virtual DOM (diffing)
4. React identifies changed elements
5. React updates only changed elements in real DOM (reconciliation)

**Why It Matters:**
```jsx
// Instead of this (slow):
document.getElementById('name').textContent = 'John';
document.getElementById('email').textContent = 'john@example.com';
document.getElementById('phone').textContent = '555-1234';
document.getElementById('whole-page').innerHTML = newHTML;

// React does this (fast):
// Only updates what changed based on Virtual DOM diff
<PersonalInfo
    name="John"
    email="john@example.com"
    phone="555-1234"
/>
```

**Benefits:**
- ✅ Minimal DOM updates (faster)
- ✅ Batch updates (better performance)
- ✅ Abstraction (developers don't manage DOM directly)

---

### 14. **What is Server-Side vs Client-Side Rendering?**

**Answer:**
**Client-Side Rendering (CSR) - Our Approach:**
- React runs in browser
- JavaScript builds the UI
- First load is slower (need to download and execute JS)
- Great for interactive apps like Resume Builder

```
User visits site
    ↓
Downloads HTML + JavaScript
    ↓
Browser executes React
    ↓
Interactive app
```

**Server-Side Rendering (SSR) - Next.js, etc:**
- Server renders React to HTML
- Browser receives ready-to-display HTML
- First load is faster
- Better SEO

```
User visits site
    ↓
Server renders React to HTML
    ↓
Browser shows ready-to-view HTML
    ↓
JavaScript hydrates for interactivity
```

**For Resume Builder, CSR is better because:**
- Heavy interactivity (real-time preview, form editing)
- User authentication (SSR would require session handling)
- Single user per browser (no caching issues)

---

### 15. **What's the Difference Between useCallback and useMemo?**

**Answer:**
Both optimize performance but are used differently:

**useCallback** - Memoize function reference:
```jsx
// Without useCallback - new function on every render
const handleLogin = async (email, password) => {
    await login(email, password);
};

// With useCallback - same function reference unless dependencies change
const handleLogin = useCallback(async (email, password) => {
    await login(email, password);
}, [login]);  // Recreate only if 'login' changes
```

**Use When:**
- Passing function to child component with React.memo
- Function is dependency in useEffect
- Event listener in useEffect

**useMemo** - Memoize computed value:
```jsx
// Without useMemo - recalculates on every render
const expensiveValue = calculateSkillsStats(resumeData.skills);

// With useMemo - only recalculates if dependencies change
const expensiveValue = useMemo(
    () => calculateSkillsStats(resumeData.skills),
    [resumeData.skills]
);
```

**Use When:**
- Expensive calculation
- Used as useEffect dependency
- Passed to React.memo child

---

### 16. **What's the Difference Between Async/Await and .then()?**

**Answer:**
Both handle promises but async/await is cleaner:

**.then() Approach:**
```jsx
const handleLogin = () => {
    authAPI.login(email, password)
        .then(response => {
            setUser(response.data.user);
            navigate('/editor');
        })
        .catch(error => {
            setError(error.response?.data?.message);
        });
};
```

**Async/Await Approach:**
```jsx
const handleLogin = async () => {
    try {
        const response = await authAPI.login(email, password);
        setUser(response.data.user);
        navigate('/editor');
    } catch (error) {
        setError(error.response?.data?.message);
    }
};
```

**Advantages of Async/Await:**
- ✅ Looks like synchronous code (easier to read)
- ✅ Uses standard try/catch (easier error handling)
- ✅ Can use normal control flow (if/loops with await)

**In Resume Builder:**
- We use async/await everywhere for cleaner code
- All API calls use async/await
- All event handlers that need async logic use async functions

---

### 17. **What is Lazy Loading and Code Splitting?**

**Answer:**
Lazy loading = load components only when needed (improves initial load time).

**Why Important:**
```
Without code splitting:
- Download entire app (500KB) → Parse → Execute
- Takes 3 seconds to become interactive

With code splitting:
- Download only initial route (100KB) → Interactive
- Load other routes on-demand
- Better initial performance
```

**Implementation:**
```jsx
// Without lazy loading - all routes in initial bundle
import Home from './pages/Home';
import Editor from './pages/Editor';
import Dashboard from './pages/Dashboard';

// With lazy loading - routes loaded on-demand
const Home = lazy(() => import('./pages/Home'));
const Editor = lazy(() => import('./pages/Editor'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Use with Suspense
<Routes>
    <Route 
        path="/editor" 
        element={
            <Suspense fallback={<LoadingSpinner />}>
                <Editor />
            </Suspense>
        } 
    />
</Routes>
```

---

### 18. **What's the Difference Between Function and Class Components?**

**Answer:**
Modern React uses **function components** (our approach), but it's good to know the difference:

**Function Components (Modern):**
```jsx
function LoginForm() {
    const [email, setEmail] = useState('');
    
    useEffect(() => {
        // Side effects
    }, []);
    
    return <form>{/* JSX */}</form>;
}
```
- ✅ Cleaner syntax
- ✅ Hooks for state and effects
- ✅ Easier to test
- ✅ Smaller bundle

**Class Components (Legacy):**
```jsx
class LoginForm extends React.Component {
    state = { email: '' };
    
    componentDidMount() {
        // Side effects
    }
    
    render() {
        return <form>{/* JSX */}</form>;
    }
}
```
- ❌ More verbose
- ❌ `this` binding issues
- ❌ Harder to test
- ❌ Larger bundle

**In Resume Builder:** All components are function components using hooks.

---

### 19. **What Happens When Component State Changes?**

**Answer:**
Process called **reconciliation**:

```
1. Component state changes (e.g., setResumeData(...))
   ↓
2. React re-renders component
   ↓
3. React creates new Virtual DOM
   ↓
4. React compares old Virtual DOM with new Virtual DOM
   ↓
5. React identifies differences (diffing)
   ↓
6. React updates only changed elements in real DOM
   ↓
7. Browser repaints affected areas
   ↓
8. Component re-renders complete
```

**Example:**
```jsx
function Editor() {
    const [resumeData, setResumeData] = useState(initialData);
    
    const handleNameChange = (name) => {
        setResumeData({
            ...resumeData,
            personalInfo: { ...resumeData.personalInfo, fullName: name }
        });
        // This triggers: state change → re-render → Virtual DOM diff → DOM update
    };
    
    return (
        <div>
            <input onChange={(e) => handleNameChange(e.target.value)} />
            <ResumePreview data={resumeData} />
        </div>
    );
}
```

---

### 20. **Why Use Environment Variables?**

**Answer:**
Environment variables let code behave differently in dev/staging/production:

**Without env vars (Bad):**
```jsx
const API_BASE_URL = 'https://api.production.com';  // Hardcoded
```

**With env vars (Good):**
```jsx
const API_BASE_URL = import.meta.env.VITE_API_URL;
```

**.env.development:**
```
VITE_API_URL=http://localhost:5000/api
```

**.env.production:**
```
VITE_API_URL=https://api.production.com
```

**Why Useful:**
- ✅ Same code runs on dev/staging/production
- ✅ Secrets stay secret (don't commit .env to git)
- ✅ Easy to change configuration without code changes
- ✅ Different API URLs per environment

**In Resume Builder:**
```jsx
let API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Vite automatically loads based on environment
// npm run dev → uses .env.development
// npm run build → uses .env.production
```

---

## Key Takeaways for Interviews

### Tech Stack Highlights
1. **React 18** - Modern UI library with hooks
2. **Vite** - Fast build tool with HMR
3. **Tailwind** - Utility-first CSS with dark mode
4. **React Router** - Client-side routing with protected routes
5. **Axios** - HTTP client with interceptors for auth
6. **Context API** - Global state without Redux
7. **Framer Motion** - Smooth animations
8. **html2pdf** - PDF export functionality

### Core Patterns
1. **Protected Routes** - Redirect unauthenticated users to login
2. **Token Refresh** - Automatic token refresh on 401
3. **Debounced Saves** - Avoid excessive API calls
4. **Safe Data Structures** - Always fallback to defaults
5. **Lazy Loading** - Potential optimization (can mention in interviews)
6. **Error Handling** - Axios interceptors + try/catch

### Project-Specific Features
1. **Multi-Resume Management** - Users can create multiple resume versions
2. **Real-Time Preview** - See changes as you type
3. **PDF Export** - Download resume as PDF
4. **Dark/Light Mode** - Theme persistence
5. **Auto-Save** - Debounced saving to backend
6. **Auth with OTP** - Secure registration flow

---

## How to Explain in Interviews

### When Asked About React/Frontend:
"I built a Resume Builder application using React 18 with Vite as the build tool. The project uses Context API for state management with three main contexts: AuthContext for user authentication, ResumeContext for resume data management, and ThemeContext for dark/light mode toggle. The application implements JWT-based authentication with automatic token refresh using Axios interceptors. The UI is styled with Tailwind CSS supporting both light and dark modes."

### When Asked About Authentication:
"The authentication flow uses JWT tokens where an accessToken is stored in localStorage for immediate API requests, while the refreshToken is stored in an httpOnly cookie. When the accessToken expires, the Axios response interceptor catches the 401 error and automatically attempts to refresh the token. If successful, it retries the original request; if it fails, the user is redirected to login."

### When Asked About State Management:
"We chose Context API over Redux because the application's state requirements are relatively simple - we have three main contexts for auth, resume data, and theme. Context API provides sufficient global state management without the boilerplate of Redux. The ResumeContext implements debounced saving where changes are saved to localStorage immediately but only synced to the backend after a 2-second delay to avoid excessive API calls."

### When Asked About Styling:
"The project uses Tailwind CSS, a utility-first CSS framework, which allowed us to build responsive UIs efficiently. We leverage Tailwind's built-in dark mode support with the 'dark:' prefix, allowing the same component to render differently based on the theme context. This approach reduces bundle size and improves consistency across the application."

---

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Tips for Interview Success

1. **Be Honest About Your Role**
   - "I built the entire frontend architecture"
   - Don't claim credit for backend work

2. **Use Actual Code Examples**
   - Reference specific files and functions
   - Explain YOUR implementation choices
   - Show off your debugged issues

3. **Demonstrate Understanding**
   - Explain "why" not just "what"
   - Discuss tradeoffs (Context vs Redux, Tailwind vs Styled Components)
   - Mention potential improvements

4. **Show Problem-Solving**
   - Token refresh logic - "I had to handle race conditions where multiple requests fail simultaneously"
   - Debounced save - "Preventing excessive API calls while maintaining good UX"
   - Safe data structures - "Defensive programming to prevent crashes from invalid data"

5. **Ask Questions**
   - "What would you do differently?"
   - "How would you scale this to 10,000 resumes?"
   - Shows you're thinking about the design

---

Good luck with your interviews! You've built a solid project that demonstrates real-world React patterns.
