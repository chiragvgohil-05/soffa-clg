import React, { useState } from 'react';
import { FaPlus, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import '../../styles/ProductCreate.css';

const ProductCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        rating: '0',
        reviewCount: '0',
        imageUrl: '',
        isNew: false,
        discount: '0',
        inStock: true
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (formData.originalPrice && parseFloat(formData.originalPrice) < parseFloat(formData.price)) {
            newErrors.originalPrice = 'Original price should be greater than or equal to current price';
        }

        if (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 5) {
            newErrors.rating = 'Rating must be between 0 and 5';
        }

        if (parseInt(formData.reviewCount) < 0) {
            newErrors.reviewCount = 'Review count cannot be negative';
        }

        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid URL';
        }

        if (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Process the form data
            const productData = {
                id: Date.now(), // Generate temporary ID
                name: formData.name.trim(),
                price: parseFloat(formData.price),
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
                rating: parseFloat(formData.rating),
                reviewCount: parseInt(formData.reviewCount),
                imageUrl: formData.imageUrl || null,
                isNew: formData.isNew,
                discount: parseFloat(formData.discount),
                inStock: formData.inStock
            };

            console.log('Product added:', productData);
            setSubmitSuccess(true);

            // Reset form after success
            setTimeout(() => {
                setFormData({
                    name: '',
                    price: '',
                    originalPrice: '',
                    rating: '0',
                    reviewCount: '0',
                    imageUrl: '',
                    isNew: false,
                    discount: '0',
                    inStock: true
                });
                setSubmitSuccess(false);
            }, 2000);

        } catch (error) {
            console.error('Error adding product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            rating: '0',
            reviewCount: '0',
            imageUrl: '',
            isNew: false,
            discount: '0',
            inStock: true
        });
        setErrors({});
        setSubmitSuccess(false);
    };

    return (
        <div className="product-form-container">
            <div className="product-form-wrapper">
                <div className="product-form-card">
                    {/* Header */}
                    <div className="product-form-header">
                        <div className="product-form-header-content">
                            <div>
                                <h1 className="product-form-title">Add New Product</h1>
                                <p className="product-form-subtitle">Fill in the product details below</p>
                            </div>
                            <div className="product-form-header-icon">
                                <FaPlus className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="product-form-success">
                            <FaCheck className="product-form-success-icon w-5 h-5" />
                            <span className="product-form-success-text">Product added successfully!</span>
                        </div>
                    )}

                    {/* Form */}
                    <div className="product-form-content">
                        <div className="product-form-grid">
                            {/* Product Name */}
                            <div className="product-form-full-width">
                                <label className="product-form-label">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`product-form-input ${errors.name ? 'product-form-input-error' : ''}`}
                                    placeholder="Enter product name"
                                />
                                {errors.name && <p className="product-form-error">{errors.name}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="product-form-label">
                                    Current Price * ($)
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`product-form-input ${errors.price ? 'product-form-input-error' : ''}`}
                                    placeholder="0.00"
                                />
                                {errors.price && <p className="product-form-error">{errors.price}</p>}
                            </div>

                            {/* Original Price */}
                            <div>
                                <label className="product-form-label">
                                    Original Price ($)
                                </label>
                                <input
                                    type="number"
                                    name="originalPrice"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    className={`product-form-input ${errors.originalPrice ? 'product-form-input-error' : ''}`}
                                    placeholder="0.00"
                                />
                                {errors.originalPrice && <p className="product-form-error">{errors.originalPrice}</p>}
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="product-form-label">
                                    Rating (0-5)
                                </label>
                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    className={`product-form-input ${errors.rating ? 'product-form-input-error' : ''}`}
                                />
                                {errors.rating && <p className="product-form-error">{errors.rating}</p>}
                            </div>

                            {/* Review Count */}
                            <div>
                                <label className="product-form-label">
                                    Review Count
                                </label>
                                <input
                                    type="number"
                                    name="reviewCount"
                                    value={formData.reviewCount}
                                    onChange={handleChange}
                                    min="0"
                                    className={`product-form-input ${errors.reviewCount ? 'product-form-input-error' : ''}`}
                                />
                                {errors.reviewCount && <p className="product-form-error">{errors.reviewCount}</p>}
                            </div>

                            {/* Image URL */}
                            <div className="product-form-full-width">
                                <label className="product-form-label">
                                    Product Image URL
                                </label>
                                <div className="product-form-image-upload">
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className={`product-form-input product-form-image-input ${errors.imageUrl ? 'product-form-input-error' : ''}`}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button
                                        type="button"
                                        className="product-form-upload-button"
                                    >
                                        <FaUpload className="w-4 h-4" />
                                    </button>
                                </div>
                                {errors.imageUrl && <p className="product-form-error">{errors.imageUrl}</p>}
                            </div>

                            {/* Discount */}
                            <div>
                                <label className="product-form-label">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    min="0"
                                    max="100"
                                    className={`product-form-input ${errors.discount ? 'product-form-input-error' : ''}`}
                                />
                                {errors.discount && <p className="product-form-error">{errors.discount}</p>}
                            </div>

                            {/* Checkboxes */}
                            <div className="product-form-checkbox-group">
                                <div className="product-form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="isNew"
                                        checked={formData.isNew}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <label className="product-form-checkbox-label">
                                        Mark as New Product
                                    </label>
                                </div>

                                <div className="product-form-checkbox">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                        className="w-4 h-4"
                                    />
                                    <label className="product-form-checkbox-label">
                                        In Stock
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="product-form-actions">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="product-form-reset"
                            >
                                <FaTimes className="w-4 h-4" />
                                <span>Reset Form</span>
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className={`product-form-submit ${isSubmitting ? 'product-form-submit-disabled' : 'product-form-submit-primary'}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="product-form-spinner"></div>
                                        <span>Adding Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="w-4 h-4" />
                                        <span>Add Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCreate;