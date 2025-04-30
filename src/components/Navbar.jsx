import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarClosed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };
  const handleLogout = () => {
    Cookies.remove("token");
    console.log("Logged out. Redirecting...");
    navigate("/login");
  };
  

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarClosed ? "closed d-none d-md-block" : ""}`} style={{ width: isSidebarClosed ? "0" : "250px" }}>
        <ul className="nav flex-column">
          <li className="nav-item">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
              <i className="bi bi-grid"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
          <Link to="/tasks" className={`nav-link ${location.pathname === "/tasks" ? "active" : ""}`}>
              <i className="fas fa-tasks"></i> Tasks
            </Link>
          </li>
          <li className="nav-item">
          <Link to="#" className={`nav-link ${location.pathname === "/setting" ? "active" : ""}`}>
          <i className="bi bi-gear"></i> Setting
            </Link>
          </li>
         
          <li className="nav-item">
            <button className="nav-link text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </li>
          
        </ul>
        <div className="sidebar-footer">
          <span>&copy; Thinksurf Media LLP 2024</span><br />
          <span>Version: 1.0.0</span>
        </div>
      </div>

      {/* Topbar */}
      <div className="topbar">
        <div>
          <span className="toggleIcon" onClick={toggleSidebar} id="toggleSidebar">
            <i className="bi bi-list"></i>
          </span>
          <span className="fw-bold ms-2 logo">Thinksurf</span>
        </div>
        <div className="dropdown">
          <span className="userDropdown" type="button" id="userDropdown" data-bs-toggle="dropdown">
            <i className="bi bi-person-circle"></i>
          </span>
          <ul className="dropdown-menu dropdown-menu-end">
            <li><Link className="dropdown-item" to="#"><i className="bi bi-person"></i> Profile</Link></li>
            {/* <li><Link className="dropdown-item" to="#"><i className="bi bi-gear"></i> Settings</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item text-danger" to="#"><i className="bi bi-box-arrow-right"></i> Logout</Link></li> */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
