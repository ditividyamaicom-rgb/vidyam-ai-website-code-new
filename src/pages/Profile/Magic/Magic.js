import React from "react";
import SidebarCom from "../../../components/Sidebar/Sidebar";
import Chat from "../../../components/Chat/Chat";
import "./magic.css";

const Magic = () => {
  return (
    <div className="magic-container">
      <SidebarCom />
      <div className="content">
        <Chat />
      </div>
    </div>
  );
};

export default Magic;
