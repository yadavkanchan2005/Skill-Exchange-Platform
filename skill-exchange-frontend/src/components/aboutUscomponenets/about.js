import React, { useState } from 'react';
import './AboutUs.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Footer from '../FooterComponents/Footer';
import HeaderNavbar from '../HeaderNavbar/HeaderNavbar'

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const navigate = useNavigate();
  return (
    <>
    <HeaderNavbar/>
      <section id="about-us">

        <div className="about-banner position-relative text-center text-white d-flex flex-column justify-content-center align-items-center">
          <div className="about-banner-overlay"></div>
          <h1 className="position-relative">About Us</h1>
          <p className="position-relative mb-0">Skill Exchange • About Us</p>
        </div>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0 about-images-wrapper">
              <div className="main-img position-relative overflow-hidden">
                <img
                  src="about1.jpeg"
                  alt="Skill Sharing"
                  className="img-fluid rounded shadow"
                />
                <div className="hover-overlay">
                  <span>500+ Successful Skills</span>
                </div>
              </div>
              <div className="small-img overflow-hidden">
                <img
                  src="about2.jpeg"
                  alt="Learning Together"
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>

            {/*  Right Text */}
            <div className="col-md-6 about-text-content">
              <h5 className="text-uppercase text-muted mb-2">Who We Are</h5>
              <h3 className="mb-4">
                Empowering people worldwide to exchange skills & learn together
              </h3>
              <p>
                Our Skill Exchange platform connects people globally to share, teach,
                and learn skills. Whether you're learning a new hobby or teaching a
                professional craft, we make knowledge sharing easy and impactful.
              </p>
              <ul className="list-unstyled">
                <li>✔ Easy skill matching</li>
                <li>✔ Real-time collaboration</li>
                <li>✔ Verified user community</li>
                <li>✔ Global reach</li>
              </ul>
              <Button variant="dark" className="rounded-pill mt-2" onClick={() => navigate('/signup')}>Join Now</Button>
            </div>

          </div>
        </div>

        <div className="stats mt-5">
          <div className="container">
            <div className="row text-center ">
              <div className="col-md-3 mb-3 ">
                <h3>3+</h3>
                <p>Years of Service</p>
              </div>
              <div className="col-md-3 mb-3">
                <h3>1000+</h3>
                <p>Skills Shared</p>
              </div>
              <div className="col-md-3 mb-3">
                <h3>500+</h3>
                <p>Active Members</p>
              </div>
              <div className="col-md-3 mb-3">
                <h3>200+</h3>
                <p>Successful Exchanges</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section with Tabs */}
        <div className="container py-5">
          <div className="row align-items-center">
            {/* Left Text with Tabs */}
            <div className="col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase text-muted mb-2">About Mission</h5>
              <h2 className="mb-4">
                Our Main Goal to Satisfy <br /> Local & Global Learners
              </h2>

              {/* Tabs */}
              <div className="d-flex gap-2 mb-3">
                <button
                  className={`btn ${activeTab === 'mission' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setActiveTab('mission')}
                >
                  Our Mission
                </button>
                <button
                  className={`btn ${activeTab === 'vision' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setActiveTab('vision')}
                >
                  Our Vision
                </button>
                <button
                  className={`btn ${activeTab === 'story' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setActiveTab('story')}
                >
                  Our Story
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'mission' && (
                <p>
                  Our mission is to build a vibrant community where skills and knowledge
                  are exchanged freely. We aim to empower learners and mentors to grow together.
                </p>
              )}
              {activeTab === 'vision' && (
                <p>
                  Our vision is to become the world’s most trusted platform for skill exchange,
                  fostering a culture of continuous learning and global collaboration.
                </p>
              )}
              {activeTab === 'story' && (
                <p>
                  Inspired by the passion to make learning borderless, we started this platform
                  to help people teach, learn and grow together — regardless of geography.
                </p>
              )}
            </div>

            {/* Right Image */}
            <div className="col-md-6 text-center">
              <img
                src="about3.jpg"
                alt="Our Mission"
                className="img-fluid rounded shadow"
                style={{ maxWidth: '80%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default AboutUs;
