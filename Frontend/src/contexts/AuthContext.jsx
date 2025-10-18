import { createContext, useContext, useEffect } from 'react';
import { useCurrentUser, useLogout } from '../services/useApi';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading, error } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success('خروج موفقیت‌آمیز بود');
        // Redirect will be handled by the router
      },
      onError: (error) => {
        toast.error(error.message || 'خطا در خروج');
      },
    });
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout: handleLogout,
    isLoggingOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
