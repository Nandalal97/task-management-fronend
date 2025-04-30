import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Tasks from './components/Tasks';
import Login from './components/Login';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './App.css';

function AppWrapper() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        
        <Route path="/" element={<ProtectedRoute><Tasks /></ProtectedRoute>
        } />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
