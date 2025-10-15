import React from "react";
import {useState} from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import "./index.css";

const App = () => {
const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="app-container">
      {/* Hamburger Button */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <Sidebar isOpen={isOpen}/>
      <div className="main-section">
        <Navbar />
        <Dashboard />
      </div>
    </div>
  );
};

export default App;
