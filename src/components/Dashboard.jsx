import React from "react";
import Cards from "./Cards";
import Charts from "./Charts";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      <Cards />
      <Charts />
    </div>
  );
};

export default Dashboard;
