import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import '../../styles/ProductCreate.css';
import Input from "../../../components/Input";
import CheckBox from "../../components/CheckBox";
import Select from "../../../components/Select";
import ImagePicker from "../../../components/ImagePicker";
import TextArea from "../../../components/TextArea";
import { useNavigate, useParams } from 'react-router-dom';
import request from "../../../apiClient";
import toast from 'react-hot-toast';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        images: [],
        isNew: false,
        discount: '0',
        inStock: true,
        brand: '',
        category: '',
        description: ''
    });

    const [existingImages, setExistingImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    const [newImages, setNewImages] = useState([]); // Store new images as Files
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await request.get(`/products/${id}`);
                const product = response.data.data;

                setFormData({
                    name: product.name || '',
                    price: product.price?.toString() || '',
                    originalPrice: product.originalPrice?.toString() || '',
                    images: [],
                    isNew: product.isNew || false,
                    discount: product.discount?.toString() || '0',
                    inStock: product.inStock !== undefined ? product.inStock : true,
                    brand: product.brand || '',
                    category: product.category || '',
                    description: product.description || ''
                });

                setExistingImages(product.images || []);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error(error.response?.data?.message || "Failed to fetch product");
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const validateDescription = (text) => {
        if (text.includes("badword")) {
            return "Inappropriate word not allowed!";
        }
        return true;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Auto-calc price when originalPrice or discount changes
            if (name === 'originalPrice' || name === 'discount') {
                const original = parseFloat(updated.originalPrice) || 0;
                const discount = parseFloat(updated.discount) || 0;
                const discountedPrice = original - (original * discount / 100);

                updated.price = discountedPrice > 0 ? discountedPrice.toFixed(2) : '';
            }

            return updated;
        });

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

        if (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100) {
            newErrors.discount = 'Discount must be between 0 and 100';
        }

        if (!formData.brand.trim()) {
            newErrors.brand = 'Brand is required';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Use FormData for text + files
            const form = new FormData();

            form.append("name", formData.name.trim());
            form.append("price", parseFloat(formData.price));
            form.append("originalPrice", formData.originalPrice ? parseFloat(formData.originalPrice) : "");
            form.append("isNew", formData.isNew);
            form.append("discount", parseFloat(formData.discount));
            form.append("inStock", formData.inStock);
            form.append("brand", formData.brand.trim());
            form.append("category", formData.category.trim());
            form.append("description", formData.description.trim());

            // Append all new images (only when form is submitted)
            if (newImages.length > 0) {
                newImages.forEach((file) => {
                    form.append("images", file);
                });
            }

            // Append removed image URLs
            removedImages.forEach((imageUrl) => {
                form.append("removedImages", imageUrl);
            });

            // Send PUT request to update the product
            await request.put(`/products/${id}`, form, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            toast.success("Product updated successfully!");
            navigate("/admin/products");

        } catch (error) {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || "Failed to update product");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        // Reset to original fetched values
        if (id) {
            // We would need to refetch the product or store initial values
            // For simplicity, we'll just reload the page
            window.location.reload();
        }
    };

    const handleImagesChange = (images) => {
        // Store the new image files for later submission
        const imageFiles = images.map(img => img.file).filter(file => file);
        setNewImages(imageFiles);

        // Update the form data to show previews (if needed)
        setFormData(prev => ({
            ...prev,
            images: images
        }));
    };

    const handleRemoveExistingImage = (imageUrl) => {
        setExistingImages(prev => prev.filter(img => img !== imageUrl));
        setRemovedImages(prev => [...prev, imageUrl]);
    };

    if (isLoading) {
        return (
            <div className="product-form-container">
                <div className="loading-spinner">
                    <div className="product-form-spinner"></div>
                    <span>Loading product data...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{cursor:"pointer"}} onClick={() => navigate(-1)}>
                    <path d="M11 6L5 12M5 12L11 18M5 12H19" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <div className="product-form-container">
                <div className="product-form-wrapper">
                    <div className="product-form-card">
                        {/* Header */}
                        <div className="product-form-header">
                            <div className="product-form-header-content">
                                <div>
                                    <h1 className="product-form-title">Edit Product</h1>
                                    <p className="product-form-subtitle">Update the product details below</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="product-form-content">
                            <form onSubmit={handleSubmit}>
                                <div className="product-form-grid">
                                    <div className="product-form-section">
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

                                        {/* Category */}
                                        <div>
                                            <Select
                                                label="Category"
                                                name="category"
                                                options={['soffa', 'chair']}
                                                value={formData.category}
                                                onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                                                placeholder="Select Category"
                                                required
                                                error={errors.category}
                                            />
                                        </div>
                                    </div>

                                    <div className="product-form-section">
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

                                        {/* Price */}
                                        <div>
                                            <Input
                                                label="Current Price (₹)"
                                                name="price"
                                                type="number"
                                                value={formData.price}
                                                readOnly
                                                placeholder="0.00"
                                                error={errors.price}
                                                disabled="disabled"
                                            />
                                        </div>
                                    </div>

                                    <div className="product-form-section">
                                        <div>
                                            <Input
                                                label="Brand"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                placeholder="e.g. Nike, Samsung"
                                                required
                                                error={errors.brand}
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
                                    </div>

                                    <div className="product-form-section">
                                        {/* Description */}
                                        <div className="product-form-full-width">
                                            <TextArea
                                                label="Product Description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                                placeholder="Enter product details..."
                                                maxLength={200}
                                                minLength={10}
                                                required={true}
                                                validation={validateDescription}
                                                errorMessage="" // Can also pass server-side error here
                                            />
                                        </div>
                                    </div>

                                    <div className="product-image-section">
                                        <div className="product-form-full-width">
                                            {/* Display existing images with option to remove */}
                                            {existingImages.length > 0 && (
                                                <div className="existing-images-container">
                                                    <label className="input-label">Existing Images</label>
                                                    <div className="existing-images-grid">
                                                        {existingImages.map((imageUrl, index) => (
                                                            <div key={index} className="existing-image-item">
                                                                <img src={imageUrl} alt={`Product ${index + 1}`} />
                                                                <span
                                                                    className="remove-image-btn"
                                                                    onClick={() => handleRemoveExistingImage(imageUrl)}
                                                                >
                                                                    <FaTimes />
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <ImagePicker
                                                onFilesChange={handleImagesChange}
                                                multiple={true}
                                                maxFiles={8}
                                                maxFileSize={10}
                                                acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
                                            />
                                        </div>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="product-form-checkbox-group">
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
                                        <span>Reset Changes</span>
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`product-form-submit ${isSubmitting ? 'product-form-submit-disabled' : 'product-form-submit-primary'}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="product-form-spinner"></div>
                                                <span>Updating Product...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPlus className="w-4 h-4" />
                                                <span>Update Product</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductEdit;