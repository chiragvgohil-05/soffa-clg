// src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css';
import {Link} from "react-router-dom";
import Logo from "../assets/Untitled design (1).png";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="main-container main">
                <div className="footer-columns">
                    <div className="footer-col">
                        <div style={{width: '175px'}}>
                            <img src={Logo} alt="" height="100%" width="100%"/>
                        </div>
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
                    <p>&copy; {new Date().getFullYear()} Elegent Furniture. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
