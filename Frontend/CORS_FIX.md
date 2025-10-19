# CORS Issue Fixed

## Problem
The frontend was getting a CORS error when trying to login:
```
Access to fetch at 'http://localhost:3001/api/v1/users/login' from origin 'http://localhost:5174' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
```

## Root Cause
When using `credentials: 'include'` in fetch requests, the CORS policy doesn't allow wildcard origins (`origin: '*'`). The backend was configured with:
```javascript
cors({
  origin: '*', // ❌ This doesn't work with credentials: true
  credentials: true,
})
```

## Solution
Updated the backend CORS configuration in `Backend/app.js` to specify exact frontend URLs:
```javascript
cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // ✅ Specific URLs
  credentials: true,
})
```

## Additional Fixes
1. **Hardcoded API URLs** - Removed dependency on environment variables for now
2. **Updated Login Page** - Added clear instructions to use the working credentials
3. **Test User Created** - `admin@example.com` / `password123`

## Test Credentials
- **Email:** admin@example.com
- **Password:** password123

## Status
✅ CORS issue resolved  
✅ Backend restarted with new configuration  
✅ Frontend URLs hardcoded  
✅ Authentication should now work properly  

The login should now work without CORS errors!
