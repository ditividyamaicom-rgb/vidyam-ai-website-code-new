import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BannerCarousel.css";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=ai.schoolcopilot.app&pcampaignid=web_share";

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const slides = [
    {
      text:
        "🎉 Vidyam LLM is here! — India's first AI aligned with NCERT Syllabus and Grade Levels.",
      link: "/blog/vidyam-llm",
      linkText: "Learn more",
    },
    {
      text:
        "The School Copilot AI Android app is now available on the Play Store. Download now!",
      link: PLAY_STORE_URL,
      linkText: "Click here",
      external: true,
    },
    {
      text:
        "Personalized learning powered by AI, based on NCERT Taxonomy and pedagogy, to enable overall growth and to make difficult concepts easier for you to understand!",
      link: null,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="banner-carousel-container">
      <div className="banner-carousel-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? "active" : ""}`}
          >
            <div className="banner-content">
              <span>{slide.text}</span>
              {slide.link && slide.external && (
                <>
                  {" "}
                  <a
                    href={slide.link}
                    className="banner-cta"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {slide.linkText || "Click here"}
                  </a>
                </>
              )}
              {slide.link && !slide.external && (
                <>
                  {" "}
                  <Link to={slide.link} className="banner-cta">
                    {slide.linkText || "Learn more"}
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
        <div className="banner-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`banner-indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
