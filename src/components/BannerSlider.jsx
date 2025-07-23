import React, { useState, useEffect } from 'react';
import '../styles/BannerSlider.css';

const BannerSlider = ({ slides = [], interval = 4000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length, interval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (slides.length === 0) {
    return <div className="banner-slider">No slides available.</div>;
  }

  return (
    <div
      className="banner-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="slider-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          >
            <div className="slide-overlay">
              <div className="slide-content">
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                {slide.buttonText && (
                  <a href={slide.buttonLink} className="slide-button">
                    {slide.buttonText}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="nav-arrow nav-arrow-left" onClick={prevSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className="nav-arrow nav-arrow-right" onClick={nextSlide}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="dots-container">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <button
        className="play-pause-btn"
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
      >
        {isAutoPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="4" width="4" height="16" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="5,3 19,12 5,21" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default BannerSlider;
