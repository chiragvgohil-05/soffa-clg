// src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css';
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="main-container main">
                <div className="footer-columns">
                    <div className="footer-col">
                        <h4>ShopEasy</h4>
                        <p>Bringing the best deals to your doorstep.</p>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/shop">Shop</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Follow Us</h4>
                        <ul>
                            <li><Link to="/">Facebook</Link></li>
                            <li><Link to="/">Twitter</Link></li>
                            <li><Link to="/">Instagram</Link></li>
                            <li><Link to="/">LinkedIn</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} ShopEasy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
