// src/components/Contact.jsx
import React, { useState } from 'react';
import Input from '../components/Input';
import '../styles/Contact.css';
import BannerSlider from "../components/BannerSlider";
import chair from '../assets/chair.jpg';

const Contact = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const slides = [
        {
            id: 1,
            image: chair,
            title: 'Contact Us',
            subtitle: 'We are here to help you',
            buttonText: '',
            buttonLink: ''
        },
    ];
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can handle API call or validation here
        console.log('Form submitted:', form);
        alert('Message sent!');
        setForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <>
                <div>
                    <BannerSlider
                        slides={slides}
                        height="500px"
                        autoPlay={true}
                        interval={3000}
                        showArrows={true}
                        showDots={true}
                        dotActiveColor="#4CAF50"
                        backgroundColor="#333" />
                </div>
            <div className="contact-container">
                <h2 className="contact-title">Contact Us</h2>
                <p className="contact-description">
                    We'd love to hear from you! Please fill out the form below.
                </p>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <Input
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                    />
                    <Input
                        name="email"
                        type="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <Input
                        name="subject"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange}
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        className="contact-textarea"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                    ></textarea>
                    <button type="submit" className="contact-button">Send Message</button>
                </form>
            </div>
        </>
    );
};

export default Contact;
