
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} sm={12}>
            <h5 className="text-uppercase fw-bold mb-3">Skill Exchange</h5>
            <p>
              Empowering global learning through virtual skill sharing. 
              Connect, grow, and inspire across borders.
            </p>
          </Col>

          <Col md={2} sm={6}>
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/explore" className="text-light text-decoration-none">Explore Skills</a></li>
              <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </Col>

          <Col md={3} sm={6}>
            <h6 className="fw-bold mb-3">Contact</h6>
            <p>Email: support@skillexchange.com</p>
            <p>Phone: +1 234 567 890</p>
          </Col>

          <Col md={3} sm={12}>
            <h6 className="fw-bold mb-3">Follow Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5"><FaFacebookF /></a>
              <a href="#" className="text-light fs-5"><FaTwitter /></a>
              <a href="#" className="text-light fs-5"><FaInstagram /></a>
              <a href="#" className="text-light fs-5"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>

        <hr className="text-secondary" />
        <div className="text-center text-secondary">
          © {new Date().getFullYear()} Skill Exchange. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
