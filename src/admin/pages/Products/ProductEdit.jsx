import React, { useState } from 'react';
import { FaPlus, FaUpload, FaTimes, FaCheck } from 'react-icons/fa';
import '../../styles/ProductCreate.css';
import Input from "../../../components/Input";
import CheckBox from "../../components/CheckBox";

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
    };

    return (
        <div className="product-form-container">
            <div className="product-form-wrapper">
                <div className="product-form-card">
                    {/* Header */}
                    <div className="product-form-header">
                        <div className="product-form-header-content">
                            <div>
                                <h1 className="product-form-title">Edit Product</h1>
                                <p className="product-form-subtitle">Fill in the product details below</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="product-form-content">
                        <div className="product-form-grid">
                            {/* Product Name */}
                            <div className="product-form-full-width">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    className="product-form-input"
                                    required
                                    error={errors.name}
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <Input
                                    label="Current Price (₹)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                    error={errors.price}
                                />
                            </div>

                            {/* Original Price */}
                            <div>
                                <Input
                                    label="Original Price (₹)"
                                    name="originalPrice"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    error={errors.originalPrice}
                                />
                            </div>

                            {/* Rating */}
                            <div>
                                <Input
                                    label="Rating (0-5)"
                                    name="rating"
                                    type="number"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    error={errors.rating}
                                />
                            </div>

                            {/* Review Count */}
                            <div>
                                <Input
                                    label="Review Count"
                                    name="reviewCount"
                                    type="number"
                                    value={formData.reviewCount}
                                    onChange={handleChange}
                                    min="0"
                                    error={errors.reviewCount}
                                />
                            </div>

                            {/* Image URL */}
                            <div className="product-form-full-width">
                                <Input
                                    label="Product Image URL"
                                    name="imageUrl"
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                    error={errors.imageUrl}
                                />
                            </div>

                            {/* Discount */}
                            <div>
                                <Input
                                    label="Discount (%)"
                                    name="discount"
                                    type="number"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    error={errors.discount}
                                />
                            </div>

                            {/* Checkboxes */}
                            <div className="product-form-checkbox-group">

                                <div className="product-form-checkbox">
                                    <CheckBox
                                        name="isNew"
                                        label="Mark as New Product"
                                        checked={formData.isNew}
                                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                                    />
                                </div>

                                <div className="product-form-checkbox">
                                    <CheckBox
                                        name="inStock"
                                        label="In Stock"
                                        checked={formData.inStock}
                                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    />
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
                                        <span>Editing Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="w-4 h-4" />
                                        <span>Edit Product</span>
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