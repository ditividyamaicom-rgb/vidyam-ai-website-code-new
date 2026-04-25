import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./accordion.css";

function MissionAccordion({ onTabChange }) {
  const [activeTab, setActiveTab] = useState(() => {
    return "platforms";
  });

  useEffect(() => {
    const checkMobile = () => {
      if (activeTab === "products") {
        setActiveTab("platforms");
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [activeTab]);

  useEffect(() => {
    if (onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mission-tabs-container">
      <div className="mission-tabs-header">
        <button
          type="button"
          className={`mission-tab-button mission-tab-platforms ${
            activeTab === "platforms" ? "mission-tab-button-active" : ""
          }`}
          onClick={() => handleTabChange("platforms")}
        >
          Platforms
        </button>
        <button
          type="button"
          className={`mission-tab-button mission-tab-models ${
            activeTab === "models" ? "mission-tab-button-active" : ""
          }`}
          onClick={() => handleTabChange("models")}
        >
          Models
        </button>
        <button
          type="button"
          className={`mission-tab-button mission-tab-products ${
            activeTab === "products" ? "mission-tab-button-active" : ""
          }`}
          onClick={() => handleTabChange("products")}
        >
          Products
        </button>
      </div>

      <div className="mission-tabs-body">
        <img
          src="/images/mission-students.png"
          alt="Graduates watermark"
          className="mission-tabs-watermark"
        />

        {activeTab === "models" && (
          <div className="mission-tab-panel">
        <h5>Vidyam LLMs: Precision Learning for Every Grade</h5>
            <p>
              General-purpose LLMs like ChatGPT often miss the mark in
              delivering precise educational content tailored to specific
              curricula. Vidyam LLM bridges this gap by providing clear,
              curriculum-aligned responses for every grade level. Whether
              you're in class 6 or class 12, Vidyam LLM ensures that you
              receive explanations that are directly aligned with your
              textbooks and syllabus.
            </p>
            <p>
              Discover More: Dive deeper into how Vidyam LLMs are
              transforming education by reading our latest blog post –{" "}
              <Link
                style={{ color: "#fff", textDecoration: "underline" }}
                to="/blog/vidyam-llm"
              >
                Introducing Vidyam LLM
              </Link>
              .
            </p>
          </div>
        )}

        {activeTab === "platforms" && (
          <div className="mission-tab-panel mission-tab-panel-platforms">
            <h3 className="platforms-main-heading">
              Vidyam AI — Building the AI Operating System for Education
            </h3>
            <p className="platforms-subheading">
              AI-native copilots for students and educators powered by an AI Teacher Brain.
            </p>

            <h4 className="platforms-section-title">
              <em>
                School Copilot (
                <a
                  href="https://www.schoolcopilot.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platforms-link"
                >
                  www.schoolcopilot.ai
                </a>
                )
              </em>
            </h4>
            <p>
              An AI copilot designed to power schools through intelligent academic workflows. Guided by pedagogy and
              learning science, it helps generate exam papers and quizzes (online/offline), evaluate answer sheets
              (objective/subjective), and create study resources, teaching material, and homework also, while enabling
              fun and interactive learning through our conversational AI, Mai.
            </p>

            <h4 className="platforms-section-title">
              <em>
                Student Copilot — Saarthi ( Try on{" "}
                <a
                  href="https://wa.me/917678910123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platforms-link"
                >
                  WhatsApp at 7678910123
                </a>{" "}
                )
              </em>
            </h4>
            <p>
              A personalized AI learning companion that adapts to each student&apos;s class, pace, and understanding.
              Guided by pedagogy and the goals of the curriculum, Saarthi helps students grasp concepts through relatable
              examples, solve doubts, and practice with personalized quizzes, bridging learning gaps and making quality
              learning accessible to every student.
            </p>

            <p className="platforms-footer">
              Together, these copilots create a connected learning ecosystem that empowers schools and helps every student
              learn the way education is meant to be experienced.
            </p>
          </div>
        )}

        {activeTab === "products" && (
          <div className="mission-tab-panel">
            <p>
              At Vidyam AI, we're dedicated to reshaping education with
              cutting-edge AI technologies. Alongside our core mission,
              we've developed two revolutionary products: Magic Email and
              Magic Doc, powered by GenAI-based technologies.
            </p>
            <p>
              <strong>Magic Email:</strong> Transform your email management
              with Magic Email. Our advanced solution comprehends virtually
              any type of content, facilitating seamless workflow execution.
              Whether it's processing emails for flight bookings, car
              bookings, or hotel bookings from your customers, Magic Email
              streamlines customer interactions and enhances service
              delivery.
            </p>
            <p>
              <strong>Magic Doc:</strong> Say goodbye to manual document
              processing with Magic Doc. Leveraging GenAI-based
              technologies, this innovative tool extracts valuable
              information from diverse documents, including invoices,
              contracts, and reports. Streamline your workflows, reduce
              manual efforts, and optimize efficiency across your
              organisation.
            </p>
            <p>
              Contact us at hello@vidyamai.com or 🇮🇳 7-678910-123 to
              explore customized solutions tailored to your specific
              usecase and to discuss pricing options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionAccordion;