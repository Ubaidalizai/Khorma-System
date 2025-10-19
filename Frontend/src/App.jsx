import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/AuthContext";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: true,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path='/' element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/purchases' element={<Purchases />} />
              <Route path='/sales' element={<Sales />} />
              <Route path='/accounts' element={<Accounts />} />
              <Route path='/reports' element={<Reports />} />
            </Route>
            
            {/* Redirect to dashboard for any unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <ToastContainer />
        </Router>
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
