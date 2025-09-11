import React, { useState } from 'react';
import '../styles/AdminProductCard.css';
import Modal from "../../components/Modal";

const ProductCard = ({
                         _id,
                         name,
                         brand,
                         category,
                         description,
                         price,
                         originalPrice,
                         discount,
                         images,
                         isNew,
                         inStock,
                         onEdit,
                         onDelete
                     }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleConfirmDelete = () => {
        onDelete(_id);
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <div className="product-card admin" style={{height:"fit-content"}}>
                {/* Image */}
                <div className="product-image-container">
                    <img
                        src={images?.[0] || 'https://via.placeholder.com/300'}
                        alt={name}
                        className="product-image"
                    />
                    <div className="product-badges">
                        {isNew && <span className="badge new">NEW</span>}
                        {discount > 0 && <span className="badge discount">{discount}% OFF</span>}
                        {!inStock && <span className="badge out-of-stock">OUT OF STOCK</span>}
                    </div>
                </div>

                {/* Info */}
                <div className="product-info">
                    <h3 className="product-name">{name}</h3>
                    <p className="product-brand">{brand}</p>
                    <p className="product-category">{category}</p>
                    <p className="product-description">{description}</p>

                    <div className="product-pricing">
                        <span className="current-price">₹{price.toFixed(2)}</span>
                        {originalPrice > price && (
                            <span className="original-price">₹{originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="admin-product-actions">
                        <button className="edit-btn" onClick={() => onEdit(_id)}>Edit</button>
                        <button className="delete-btn" onClick={() => setIsDeleteModalOpen(true)}>Delete</button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Confirm Delete"
                size="small"
            >
                <p>Are you sure you want to delete <strong>{name}</strong>?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsDeleteModalOpen(false)}
                        style={{
                            backgroundColor: '#e5e7eb',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </>
    );
};

export default ProductCard;
