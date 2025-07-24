import React from 'react';
import '../styles/ImageGrid.css';

const ImageGrid = ({ images = [] }) => {
    return (
        <div className="image-grid">
            {images.map((img, index) => (
                <div className="image-item" key={index}>
                    <img src={img.url} alt={img.alt || `Image ${index}`} />
                    <div className="overlay">
                        <span className="overlay-text">{img.text}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
