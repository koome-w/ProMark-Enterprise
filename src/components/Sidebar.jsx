import React from "react";
import { FaChartBar, FaBoxes, FaUsers, FaClipboardList, FaCogs } from "react-icons/fa";

const Sidebar = ({isOpen}) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <h2 className="logo">ProMark Enterprise</h2>
      <ul className="nav-links">
        <li><FaChartBar /> Dashboard</li>
        <li><FaBoxes /> Inventory</li>
        <li><FaClipboardList /> Sales</li>
        <li><FaUsers /> Customers</li>
        <li><FaCogs /> Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
