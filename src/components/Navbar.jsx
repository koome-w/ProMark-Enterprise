import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="navbar">
      <input type="text" placeholder="Search..." className="search-bar" />
      <div className="nav-actions">
        <FaBell className="icon" />
        <FaUserCircle className="icon" />
      </div>
    </div>
  );
};

export default Navbar;
