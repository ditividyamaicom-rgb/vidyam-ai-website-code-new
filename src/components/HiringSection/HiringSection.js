import React from "react";
import "./hiringSection.css";

const HiringSection = () => {
  return (
    <section id="career" className="hiring-section">
      <div className="hiring-background-pattern"></div>
      <div className="hiring-container">
        <div className="hiring-header">
          <h2 className="hiring-title">We are Hiring!</h2>
          <p className="hiring-subtitle">
            If you see yourself contributing to our vision and growing with us, join a team shaping tomorrow's learning. Feel free to reach out—we can't wait to meet you!
          </p>
          <div className="hiring-email-container">
            <p className="hiring-email">
              <span className="email-label">Mail us at:</span> <span className="email-address">hr@vidyamai.com</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HiringSection;

