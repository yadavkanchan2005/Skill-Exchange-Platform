import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import heroImage from '../../assets/icons/home.png';
import './Herosection.css';
import { useNavigate } from 'react-router-dom';
export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <div className="hero-section">
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-4 mb-md-0" >
                        <h1 className="display-5 fw-bold">Learn. Share. Grow.</h1>
                        <p className="lead"><strong>
                            Exchange your skill and grow together! Join our community of learners and doers.</strong>
                        </p>
                        <Button  className="me-2" onClick={() => navigate('/signup')} style={{ width: '130px', height: '40px', padding: '4px 8px' }}>Get Started</Button>
                       
                    </Col>
                    <Col md={6} className="text-center">
                        <img src={heroImage} alt="Hero" className="img-fluid hero-img" />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
