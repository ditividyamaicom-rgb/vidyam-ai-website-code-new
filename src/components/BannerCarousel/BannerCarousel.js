import React, { useState, useEffect } from 'react';
import './BannerCarousel.css';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      text: "Personalized learning powered by AI to make difficult concepts easier for you to understand!",
      link: null
    },
    {
      text: "Vidyam AI Proudly Announces Vidyam LLM – Transform Your Learning Experience with the First in Series Aligned with NCERT Syllabus and Grade Levels.",
      link: "/blog/vidyam-llm"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="banner-carousel-container">
      <div className="banner-carousel-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <div className="banner-content">
              <span>{slide.text}</span>
              {slide.link && (
                <a href={slide.link} className="banner-learn-more">
                  {' '}Learn More
                </a>
              )}
            </div>
          </div>
        ))}
        <div className="banner-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`banner-indicator ${index === currentSlide ? 'active' : ''}`}
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

