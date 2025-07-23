import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const initialCartItems = [
  {
    id: 'smartphone',
    name: 'Smartphone Pro',
    description: 'Latest model with advanced features',
    price: 899.99,
    quantity: 1,
    icon: '📱'
  },
  {
    id: 'bluetooth-speaker',
    name: 'Bluetooth Speaker',
    description: 'Portable speaker with great sound',
    price: 59.99,
    quantity: 2,
    icon: '🔊'
  }
];

const products = [
  {
    id: 'wireless-headphones',
    name: 'Wireless Headphones',
    description: 'Premium quality sound',
    price: 79.99,
    icon: '🎧'
  },
  {
    id: 'smart-watch',
    name: 'Smart Watch',
    description: 'Track your fitness goals',
    price: 199.99,
    icon: '⌚'
  },
  {
    id: 'laptop-stand',
    name: 'Laptop Stand',
    description: 'Ergonomic design',
    price: 45.0,
    icon: '💻'
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) return removeItem(itemId);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = itemId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const addProduct = product => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="shop_cart_container">
      <div className="cart-section">
        <div className="cart-header">
          <i className="fas fa-shopping-cart"></i>
          <h1>Your Shopping Cart</h1>
        </div>

        <div id="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-cart"></i>
              <h3>Your cart is empty</h3>
              <p>Add some products from the showcase below!</p>
              <button
                className="continue-shopping"
                onClick={() => window.location.reload()}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">{item.icon}</div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-description">{item.description}</div>
                  <div className="item-price">${item.price.toFixed(2)}</div>
                </div>
                <div className="quantity-controls">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="product-showcase">
          <h3 style={{ color: 'white', marginBottom: 20, textAlign: 'center' }}>
            Add More Items
          </h3>
          <div className="product-grid">
            {products.map(product => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => addProduct(product)}
              >
                <div className="product-icon">{product.icon}</div>
                <h4>{product.name}</h4>
                <p style={{ color: '#666', fontSize: 14 }}>{product.description}</p>
                <p
                  style={{
                    fontWeight: 700,
                    color: '#667eea',
                    margin: '10px 0'
                  }}
                >
                  ${product.price.toFixed(2)}
                </p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h2 className="summary-title">Order Summary</h2>
        <div id="summary-content">
          <div className="summary-row">
            <span>
              Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              items):
            </span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row">
            <span>Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn" onClick={() => alert('Proceeding to checkout!')}>
            <i className="fas fa-credit-card" style={{ marginRight: 10 }}></i>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;