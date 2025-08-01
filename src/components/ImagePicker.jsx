import React, { useState, useCallback, useRef } from 'react';
import '../styles/ImagePicker.css';

const ImagePicker = ({
                         title = "Upload Images",
                         description = "Drag & drop images here or click to browse",
                         multiple = true,
                         maxFiles = 10,
                         maxFileSize = 5, // in MB
                         acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
                         onFilesChange,
                         initialImages = []
                     }) => {
    const [images, setImages] = useState(initialImages);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    // Handle file validation
    const validateFiles = (files) => {
        setError(null);

        if (!multiple && files.length > 1) {
            setError('Only single file allowed');
            return false;
        }

        if (files.length + images.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} files`);
            return false;
        }

        for (let file of files) {
            if (!acceptedFormats.includes(file.type)) {
                setError(`Invalid file format: ${file.name}. Only ${acceptedFormats.join(', ')} are allowed.`);
                return false;
            }

            if (file.size > maxFileSize * 1024 * 1024) {
                setError(`File too large: ${file.name}. Max size is ${maxFileSize}MB.`);
                return false;
            }
        }

        return true;
    };

    // Process selected files
    const processFiles = (files) => {
        const fileArray = Array.from(files);
        if (!validateFiles(fileArray)) return;

        const newImages = fileArray.map(file => ({
            id: URL.createObjectURL(file), // using object URL as temporary ID
            file,
            preview: URL.createObjectURL(file),
            name: file.name
        }));

        setImages(prev => [...prev, ...newImages]);
        if (onFilesChange) onFilesChange([...images, ...newImages]);
    };

    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length) {
            processFiles(files);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files.length) {
            processFiles(files);
        }
        e.target.value = ''; // Reset input to allow selecting same file again
    };

    // Remove image from selection
    const removeImage = (id) => {
        const imageToRemove = images.find(img => img.id === id);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview); // Clean up memory
        }

        const updatedImages = images.filter(img => img.id !== id);
        setImages(updatedImages);
        if (onFilesChange) onFilesChange(updatedImages);
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="image-picker-container">
            <div
                className={`image-picker-dropzone ${isDragging ? 'active' : ''}`}
                onClick={triggerFileInput}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="image-picker-input"
                    onChange={handleFileInputChange}
                    accept={acceptedFormats.join(',')}
                    multiple={multiple}
                />
                <button className="image-picker-button">Select Images</button>
                <p>or drag and drop files here</p>
            </div>

            {error && <div className="image-picker-error">{error}</div>}

            {images.length > 0 && (
                <>
                    <div className="image-picker-preview">
                        {images.map((image) => (
                            <div key={image.id} className="image-picker-preview-item">
                                <img
                                    src={image.preview}
                                    alt={image.name}
                                    className="image-picker-preview-img"
                                />
                                <button
                                    className="image-picker-remove-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(image.id);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="image-picker-status">
                        {images.length} {images.length === 1 ? 'file' : 'files'} selected
                    </div>
                </>
            )}
        </div>
    );
};

export default ImagePicker;