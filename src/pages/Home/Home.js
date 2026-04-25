import React from "react";

// import Question1 from '../components/question1'
import "../../style.css";
import "./home.css";
import Hero from "../../components/HeroSection/Hero";
import HomeBody from "../../components/HomeBody/HomeBody";
// import { Button } from "bootstrap";

const Home = (props) => {
  return (
    <div className="home-container">
      <Hero />
      <HomeBody />
    </div>
  );
};

export default Home;
