# Authentication Setup Guide

## Overview

This frontend now includes a complete authentication system with login/logout functionality using React Query and cookie-based token management.

## Features Implemented

### 1. Login Page (`/login`)

- Beautiful Persian language interface
- Form validation with React Hook Form
- Password visibility toggle
- Loading states and error handling
- Responsive design using your custom CSS variables

### 2. Authentication API Integration

- Login API call with credentials
- Logout API call
- Token refresh functionality
- Current user data fetching
- Cookie-based authentication (credentials: "include")

### 3. React Query Hooks

- `useLogin()` - Login mutation
- `useLogout()` - Logout mutation
- `useCurrentUser()` - Get current user data
- `useRefreshToken()` - Refresh token mutation

### 4. Authentication Context

- Global auth state management
- User data and authentication status
- Logout functionality
- Loading states

### 5. Protected Routes

- Automatic redirect to login for unauthenticated users
- Loading spinner during auth check
- Preserve intended destination after login

### 6. Header Integration

- User information display
- Logout button with loading state
- Dynamic user name and role display

## Environment Configuration

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Backend API Endpoints Expected

The frontend expects these endpoints on your backend:

- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh` - Refresh token
- `GET /api/v1/users/profile` - Get current user

## API Request/Response Format

### Login Request

```json
{
  "email": "string",
  "password": "string"
}
```

### Login Response

```json
{
  "user": {
    "id": "string",
    "username": "string",
    "name": "string",
    "role": "string"
  },
  "message": "string"
}
```

## Usage

1. Set up your backend authentication endpoints
2. Configure the `VITE_API_URL` environment variable
3. Start the frontend: `npm run dev`
4. Navigate to `/login` to test authentication

## Security Notes

- All API calls include `credentials: "include"` for cookie handling
- Tokens are managed via HTTP-only cookies (backend responsibility)
- Automatic token refresh on API calls
- Proper error handling for authentication failures

## Customization

The login page uses your existing design system:

- CSS variables from `index.css`
- Persian fonts (Vazirmatn, Tajawal)
- RTL layout support
- Custom color scheme (brown/amber theme)
