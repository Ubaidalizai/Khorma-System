import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Sales from "./pages/Sales";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import "./index.css";

function App() {
  return (
    <Router>
      <div className='App'>
        <Layout>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/inventory' element={<Inventory />} />
            <Route path='/purchases' element={<Purchases />} />
            <Route path='/sales' element={<Sales />} />
            <Route path='/accounts' element={<Accounts />} />
            <Route path='/reports' element={<Reports />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
