import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import '../../styles/ProductCreate.css';
import Input from "../../../components/Input";
import CheckBox from "../../components/CheckBox";
import Select from "../../../components/Select";
import ImagePicker from "../../../components/ImagePicker";
import TextArea from "../../../components/TextArea";
import { useNavigate } from 'react-router-dom';
import request from "../../../apiClient";
import toast from 'react-hot-toast';

const ProductCreate = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        originalPrice: '',
        imageUrl: '',
        isNew: false,
        discount: '0',
        inStock: true,
        brand: '',
        category: '',
        description: ''
    });
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [description, setDescription] = useState("");

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

        if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
            newErrors.imageUrl = 'Please enter a valid URL';
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

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // ✅ Use FormData for text + files
            const form = new FormData();

            form.append("name", formData.name.trim());
            form.append("price", parseFloat(formData.price));
            form.append("originalPrice", formData.originalPrice ? parseFloat(formData.originalPrice) : "");
            form.append("isNew", formData.isNew);
            form.append("discount", parseFloat(formData.discount));
            form.append("inStock", formData.inStock);
            form.append("brand", formData.brand.trim());
            form.append("category", formData.category.trim());
            form.append("description", description.trim());

            // ✅ Append all images
            if (formData.images?.length) {
                formData.images.forEach((file) => {
                    form.append("images", file); // ✅
                });
            }

            // ✅ Send request with multipart/form-data
            await request.post("/products", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Product created successfully!");
            resetForm();
            navigate("/admin/products");

        } catch (error) {
            console.error("Error creating product:", error);
            toast.error(error.response?.data?.message || "Failed to create product");
        } finally {
            setIsSubmitting(false);
        }
    };
    const resetForm = () => {
        setFormData({
            name: '',
            price: '',
            originalPrice: '',
            imageUrl: '',
            isNew: false,
            discount: '0',
            inStock: true,
            brand: '',
            category: '',
        });
        setDescription('')
        setErrors({});
    };

    const handleImagesChange = (images) => {
        setFormData((prev) => ({
            ...prev,
            images: images.map(img => img.file) // only keep File objects
        }));
    };

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
                                    <h1 className="product-form-title">Add New Product</h1>
                                    <p className="product-form-subtitle">Fill in the product details below</p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="product-form-content">
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
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
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
                                        <ImagePicker
                                            onFilesChange={handleImagesChange}
                                            multiple={true}
                                            maxFiles={8}
                                            maxFileSize={10} // 10MB
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

        </>
    );
};

export default ProductCreate;