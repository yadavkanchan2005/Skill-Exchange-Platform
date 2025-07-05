import React, { useState } from 'react';
import './contactus.css';
import Footer from '../FooterComponents/Footer';
import HeaderNavbar from '../../components/HeaderNavbar/HeaderNavbar';
import { useNavigate } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userInfo = {
            access_key: "afe134df-c67a-4d1c-b019-4b321ecb21db",
            name: formData.name,
            email: formData.email,
            message: formData.message
        }
        try {
            await axios.post("https://api.web3forms.com/submit", userInfo);
            toast.success("Message sent successfully!");
        } catch (error) {
            toast.error("An error occurred");
        }
        navigate('/thank-you');
    }
    return (
        <>
            <HeaderNavbar />

            <section id="custom-contact">
                <div className="custom-contact-banner">
                    <div className="custom-contact-overlay"></div>
                    <div className="custom-contact-text text-center text-white">
                        <h1>Contact Us</h1>
                        <p>We’re here to help you. Let’s connect!</p>
                        <div className="custom-contact-info">
                            <span><PhoneIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} /> +91 12345 67890</span>
                            <span><EmailIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} /> support@skillexchange.com</span>
                            <span><LocationOnIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} /> India</span>
                        </div>
                    </div>
                </div>

                <div className="custom-contact-container">
                    <h2>Let's get in touch</h2>
                    <p>Have questions or feedback? Send us a message and we’ll get back to you soon!</p>
                    <form onSubmit={handleSubmit} className="custom-contact-form">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <label>Message</label>
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </section>
            <Footer />
            <ToastContainer />
        </>
    );
}

export default ContactUs;
