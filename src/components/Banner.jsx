import React from 'react';
import '../styles/Banner.css';

const Banner = ({
                    imageUrl,
                    title,
                    subtitle,
                    description,
                    ctaText,
                    ctaLink,
                    layout = 'left', // or 'right'
                    backgroundColor = '#f8f9fa',
                    textColor = '#333',
                    ctaColor = '#4CAF50',
                    overlayOpacity = 0.3,
                    minHeight = '400px'
                }) => {
    return (
        <div
            className="banner"
            style={{
                backgroundColor,
                minHeight
            }}
        >
            <div className={`banner-inner layout-${layout}`}>
                <div className="banner-image-container">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="banner-image"
                        style={{ opacity: 1 - overlayOpacity }}
                    />
                </div>

                <div className="banner-content" style={{ color: textColor }}>
                    {subtitle && <h3 className="banner-subtitle">{subtitle}</h3>}
                    <h2 className="banner-title">{title}</h2>
                    {description && <p className="banner-description">{description}</p>}
                    {ctaText && (
                        <a
                            href={ctaLink || '#'}
                            className="banner-cta"
                            style={{ backgroundColor: ctaColor }}
                        >
                            {ctaText}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Banner;
