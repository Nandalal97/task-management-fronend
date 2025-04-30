import React from 'react'
import { Link, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const BottomNav = () => {
 const location = useLocation();
 const navigate = useNavigate();
   const handleLogout = () => {
      Cookies.remove('token');
      navigate('/login');
    };

  return (
    <>
    <div className="bottom-nav d-md-none">
    <Link to="/" className={`${location.pathname === "/" ? "active" : ""}`}><i className="bi bi-speedometer2"></i>Dashboard</Link>
    <Link to="/tasks" className={`${location.pathname === "/tasks" ? "active" : ""}`}><i className="fas fa-tasks"></i>task</Link>
    <Link to="#" className={`${location.pathname === "/setting" ? "active" : ""}`}><i className="bi bi-gear"></i>Settings</Link>
    <Link to="/login" className='text-danger' onClick={handleLogout}><i className="bi bi-box-arrow-right"></i>Logout</Link>
  </div>

    </>
  )
}

export default BottomNav