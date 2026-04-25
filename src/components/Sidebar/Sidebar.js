import React from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
// import { Link } from 'react-scroll';

const SidebarCom = () => {
  return (
    <div className="sidebar-conatiner">
      <nav className="main-menu">
        <ul>
          <li className="has-subnav">
            <Link to="/magic">
              <i className="fa fa-home fa-2x"></i>
              <span className="nav-text">DZero Magic</span>
            </Link>
          </li>
          <li className="has-subnav">
            <Link to="/magic-chat">
              <i className="fa fa-globe fa-2x"></i>
              <span className="nav-text">DZero Magic Chat</span>
            </Link>
          </li>
          <li className="has-subnav">
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
          </li>
          <li className="has-subnav">

            <Link to="/form-chat">
              <i className="fa fa-comment fa-2x"></i>
              <span className="nav-text">Form Chat </span>
              </Link>
            </li>
            
            <li>
            <Link to="/quiz-data">
            <i class="fa fa-clipboard fa-2x"></i>
              <span className="nav-text">Student Quiz Data </span>

            </Link>
            </li>

            <li>
            <Link to="/quiz-history">
            {/* <i class="fa fa-clipboard fa-2x"></i> */}
            <i class="fa fa-file fa-2x"></i>
              <span className="nav-text">Quiz History </span>
            </Link>
            </li>

            <li>
            <Link to="/user-data">
              <i className="fa fa-user fa-2x"></i>
              <span className="nav-text">User Data </span>

            </Link>
            </li>
            <li>
            <Link to="/data-analytics">
            <i class="fa fa-bar-chart-o"></i>
              <span className="nav-text">Data-analytics</span>
            </Link>
          </li>
          <li>
            <Link to = "/quiz-analytics">
            <i class="fa fa-sitemap"></i>
            <span className="nav-text">Quiz Analytics</span>
            </Link>
          </li>

          <li>
            <Link to = "/serper">
            <i class="fa fa-table"></i>
            <span className="nav-text">Real Time Questions</span>
            </Link>
          </li>
          
          <li>
            <Link to="/engagement/user-engagement">
              <i className="fa fa-users fa-2x"></i>
              <span className="nav-text">User Engagement</span>
            </Link>
          </li>
          
          {/* <li>
            <Link to="/chat-classification">
            <i class="fa fa-table"></i>
              <span className="nav-text">Chat-classification</span>
            </Link>
          </li>
          <li>
            <Link to="/chat-classification-filtered">
            <i class="fa fa-table"></i>
              <span className="nav-text">Chat-classification filtered</span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarCom;
