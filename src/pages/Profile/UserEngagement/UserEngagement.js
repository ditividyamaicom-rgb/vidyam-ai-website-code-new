import React from "react";
import "./userEngagement.css";
import SidebarCom from "../../../components/Sidebar/Sidebar";

const UserEngagement = () => {
  return (
    <div className="user-engagement-container">
      <SidebarCom />
      <div className="user-engagement-content">
        <h1>User Engagement</h1>
        <p>User Engagement analytics and insights will be displayed here.</p>
      </div>
    </div>
  );
};

export default UserEngagement;

