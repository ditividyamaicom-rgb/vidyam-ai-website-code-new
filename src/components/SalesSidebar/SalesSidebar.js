import React from "react";
import { Link } from "react-router-dom";
import "./salesSidebar.css";
// import { Link } from 'react-scroll';

const SalesSidebar = () => {
  return (
    <div className="sidebar-conatiner">
      <nav className="main-menu">
        <ul>
          {/* <li className="has-subnav">
            <Link to="/magic">
              <i className="fa fa-home fa-2x"></i>
              <span className="nav-text">DZero Magic</span>
            </Link>
          </li> */}
          <li className="has-subnav">
            <Link to="/sales-magic-chat">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">Magic Email</span>
            </Link>
          </li>
          {/* <li className="has-subnav">
            <Link to="/magic-chat-pro">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">DZero Magic Chat Pro </span>
            </Link>
          </li>
          <li className="has-subnav">
            <Link to="/bot-messages">
              <i className="fa fa-comments fa-2x"></i>
              <span className="nav-text">Magic Chats </span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default SalesSidebar;
