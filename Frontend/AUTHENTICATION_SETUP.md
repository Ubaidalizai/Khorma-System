# Authentication Setup Guide

This document explains how the authentication system is integrated into the frontend.

## Components Created

### 1. Authentication Context (`src/contexts/AuthContext.jsx`)
- Manages global authentication state
- Provides login, logout, and token refresh functionality
- Handles user profile data
- Automatically checks authentication status on app load

### 2. Authentication Hook (`src/hooks/useAuth.js`)
- Simple wrapper around the AuthContext
- Provides easy access to authentication functions and state

### 3. Login Page (`src/pages/Login.jsx`)
- Beautiful Persian login form
- Handles form validation and submission
- Shows loading states and error messages
- Includes demo credentials for testing

### 4. Protected Route Component (`src/components/ProtectedRoute.jsx`)
- Wraps protected pages to ensure authentication
- Shows loading spinner while checking auth status
- Redirects to login if not authenticated

### 5. Updated Header Component (`src/components/Header.jsx`)
- Added user dropdown menu with logout functionality
- Shows user information (name, email, role)
- Includes click-outside handler for dropdown

## API Integration

### Updated API Configuration (`src/services/apiConfig.js`)
- Added `credentials: 'include'` for cookie-based authentication
- Improved token refresh mechanism
- Better error handling for authentication failures

### Authentication API Functions (`src/services/apiUtiles.js`)
- `loginUser()` - Handles user login
- `logoutUser()` - Handles user logout
- `refreshUserToken()` - Refreshes expired tokens
- `getUserProfile()` - Fetches user profile data

### React Query Hooks (`src/services/useApi.js`)
- `useLogin()` - Login mutation hook
- `useLogout()` - Logout mutation hook
- `useRefreshToken()` - Token refresh hook
- `useUserProfile()` - User profile query hook

## Route Protection

### Updated App.jsx
- Wrapped app with `AuthProvider`
- Added login route as public
- Protected all main application routes
- Added redirect for unmatched routes

## Environment Configuration

Create a `.env` file in the Frontend directory with:

```env
VITE_API_URL=http://localhost:3000
VITE_BASE_URL=http://localhost:3000
```

## Usage

### Login Flow
1. User visits any protected route
2. If not authenticated, redirected to `/login`
3. User enters credentials and submits form
4. On successful login, redirected to dashboard
5. User information displayed in header

### Logout Flow
1. User clicks on user avatar in header
2. Clicks "خروج از سیستم" (Logout)
3. System calls logout API
4. Clears local storage and redirects to login

### Token Management
- Access tokens stored in localStorage
- Refresh tokens handled via HTTP-only cookies
- Automatic token refresh on API calls
- Fallback to login page if refresh fails

## Backend Requirements

The backend should have these endpoints:
- `POST /users/login` - User login
- `POST /users/logout` - User logout  
- `POST /users/refresh` - Token refresh
- `GET /users/profile` - User profile

## Testing

Use these demo credentials for testing:
- **Email:** admin@example.com
- **Password:** password123

## Security Features

- HTTP-only cookies for refresh tokens
- Automatic token refresh
- Secure logout with server-side token invalidation
- Route protection for authenticated pages
- Loading states and error handling
