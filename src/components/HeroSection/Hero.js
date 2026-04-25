// Hero.js

import React from "react";
import "./hero.css";
import ChatBot from "../ChatBot/ChatBot";

const Hero = () => {
  return (
    <>
      <div className="home-hero">
        <div className="hero-container">
          {/* Watermark Icons */}
          <div className="watermark-icons">
            <img 
              src="/images/chatbot.svg" 
              alt="Chatbot" 
              className="watermark-icon watermark-top-left watermark-chatbot-icon" 
            />
            <img 
              src="/images/ai.svg" 
              alt="AI" 
              className="watermark-icon watermark-top-right watermark-ai-icon" 
            />
            <img 
              src="/images/graduation-cap.svg" 
              alt="Graduation Cap" 
              className="watermark-icon watermark-bottom-left watermark-graduation-icon" 
            />
            <img 
              src="/images/bulb.svg" 
              alt="Lightbulb" 
              className="watermark-icon watermark-bottom-right watermark-bulb-icon" 
            />
          </div>

          <div className="hero-body">
            <h1 className="hero-title-pill">Redefining Education with AI</h1>
          </div>
          
          {/* Floating Chatbot - Fixed position */}
          <ChatBot />
     
        </div>
      </div>
    </>
  );
};

export default Hero;
