// ========================================
// API Configuration and Utilities
// ========================================

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Get refresh token from localStorage
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Set auth tokens in localStorage
export const setAuthTokens = (authToken, refreshToken) => {
  localStorage.setItem("authToken", authToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

// Clear auth tokens from localStorage
export const clearAuthTokens = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
};

// Get default headers with authentication
const getDefaultHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Handle API response
const handleApiResponse = async (response) => {
  if (!response.ok) {
    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            setAuthTokens(refreshData.accessToken, refreshData.refreshToken);
            // Retry original request with new token
            return fetch(response.url, {
              ...response,
              headers: {
                ...getDefaultHeaders(),
                Authorization: `Bearer ${refreshData.accessToken}`,
              },
            });
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
          clearAuthTokens();
          window.location.href = "/login";
        }
      } else {
        clearAuthTokens();
        window.location.href = "/login";
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleApiResponse(response);
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    LOGOUT: "/users/logout",
    REFRESH: "/users/refresh",
    PROFILE: "/users/profile",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
    CREATE: "/products",
    UPDATE: (id) => `/products/${id}`,
    DELETE: (id) => `/products/${id}`,
  },

  // Inventory/Stock
  STOCK: {
    LIST: "/stock",
    INVENTORY: "/stock?location=Inventory",
    STORE: "/stock?location=Store",
    DETAIL: (id) => `/stock/${id}`,
    CREATE: "/stock",
    UPDATE: (id) => `/stock/${id}`,
    DELETE: (id) => `/stock/${id}`,
  },

  // Stock Transfers
  STOCK_TRANSFER: {
    LIST: "/stock-transfer",
    CREATE: "/stock-transfer",
    DETAIL: (id) => `/stock-transfer/${id}`,
    DELETE: (id) => `/stock-transfer/${id}`,
  },

  // Purchases
  PURCHASES: {
    LIST: "/purchases",
    DETAIL: (id) => `/purchase/${id}`,
    CREATE: "/purchases",
    UPDATE: (id) => `/purchases/${id}`,
    DELETE: (id) => `/purchases/${id}`,
    RESTORE: (id) => `/purchases/${id}/restore`,
  },

  // Sales
  SALES: {
    LIST: "/sale",
    DETAIL: (id) => `/sale/${id}`,
    CREATE: "/sale",
    UPDATE: (id) => `/sale/${id}`,
    DELETE: (id) => `/sale/${id}`,
  },

  // Suppliers
  SUPPLIERS: {
    LIST: "/suppliers",
    DETAIL: (id) => `/suppliers/${id}`,
    CREATE: "/suppliers",
    UPDATE: (id) => `/suppliers/${id}`,
    DELETE: (id) => `/supplier/${id}`,
  },

  // Customers
  CUSTOMERS: {
    LIST: "/customers",
    DETAIL: (id) => `/customers/${id}`,
    CREATE: "/customers",
    UPDATE: (id) => `/customers/${id}`,
    DELETE: (id) => `/customers/${id}`,
  },

  // Accounts
  ACCOUNTS: {
    LIST: "/accounts",
    DETAIL: (id) => `/accounts/${id}`,
    CREATE: "/accounts",
    UPDATE: (id) => `/accounts/${id}`,
    DELETE: (id) => `/accounts/${id}`,
  },

  // Types
  TYPES: {
    LIST: "/type",
    CREATE: "/type",
    UPDATE: (id) => `/type/${id}`,
    DELETE: (id) => `/type/${id}`,
  },

  // Units
  UNITS: {
    LIST: "/unit",
    CREATE: "/unit",
    UPDATE: (id) => `/unit/${id}`,
    DELETE: (id) => `/unit/${id}`,
  },

  // Employees
  EMPLOYEES: {
    LIST: "/employees",
    DETAIL: (id) => `/employees/${id}`,
    CREATE: "/employees",
    UPDATE: (id) => `/employees/${id}`,
    DELETE: (id) => `/employees/${id}`,
  },

  // Audit Logs
  AUDIT_LOGS: {
    LIST: "/audit-logs",
    BY_TABLE: (table) => `/audit-logs/table/${table}`,
    BY_RECORD: (id) => `/audit-logs/record/${id}`,
  },

  // Expenses
  EXPENSES: {
    LIST: "/expenses",
    DETAIL: (id) => `/expenses/${id}`,
    CREATE: "/expenses",
    UPDATE: (id) => `/expenses/${id}`,
    DELETE: (id) => `/expenses/${id}`,
    RESTORE: (id) => `/expenses/${id}/restore`,
    BY_CATEGORY: (categoryId) => `/expenses/category/${categoryId}`,
    STATS: "/expenses/stats",
    SUMMARY: "/expenses/summary",
  },

  // Income
  INCOME: {
    LIST: "/income",
    DETAIL: (id) => `/income/${id}`,
    CREATE: "/income",
    UPDATE: (id) => `/income/${id}`,
    DELETE: (id) => `/income/${id}`,
    RESTORE: (id) => `/income/${id}/restore`,
    BY_CATEGORY: (categoryId) => `/income/category/${categoryId}`,
    BY_SOURCE: (source) => `/income/source/${source}`,
    STATS: "/income/stats",
    SUMMARY: "/income/summary",
  },
};

export default API_BASE_URL;

