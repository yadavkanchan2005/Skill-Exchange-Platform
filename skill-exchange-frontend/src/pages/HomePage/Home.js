
import { Container, Row, Col, Button } from 'react-bootstrap';
import HeaderNavbar from '../../components/HeaderNavbar/HeaderNavbar';
import HeroSection from '../../components/HeroSectionComponents/Herosection';
import './Home.css';
import Footer from '../../components/FooterComponents/Footer';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <HeaderNavbar />
      <HeroSection />
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img
                src="home.jpeg"
                alt="Empowering Connections"
                className="home-image"
                style={{ maxWidth: '80%', height: 'auto' }}
              />
            </Col>
            <Col md={6}>
              <h4 className="fw-bold text-dark mb-3">
                Empowering Connections <br /> On Our Virtual Skills Exchange Platform
              </h4>
              <p className="text-muted mb-4">
                Welcome to Our Community! Our platform is designed to connect individuals worldwide who are passionate about expanding their knowledge, sharing their expertise, and learning from others in a supportive community environment.
              </p>
              <Button className="rounded-pill btn-sm" onClick={() => navigate('/about-us')} style={{ width: '100px', height: '40px', padding: '4px 8px' }}>Red more</Button>

            </Col>
          </Row>
        </Container>
      </section>

      {/* --- How It Works Section --- */}
      <section id="how-it-works" className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5">How Does It Work?</h2>
          <Row className="align-items-center border-top border-bottom py-4">
            <Col md={1} className="fw-bold text fs-4">01</Col>
            <Col md={5}>
              <h5 className="fw-semibold">Create Your Profile</h5>
              <p className="text-muted">
                Set up your profile highlighting your skills. Introduce yourself briefly. Share your passions and why you're excited about skill exchange.
              </p>
              <Button className="rounded-pill px-4" onClick={() => navigate('/signup')} style={{ width: '150px', height: '40px', padding: '4px 8px' }}>Get Started</Button>
            </Col>
            <Col md={3}>
              <img
                src="/profile.jpeg"
                alt="Step 1"
                className="img-fluid rounded-3 shadow"
              />
            </Col>
            <Col md={3}>
              <p className="text-muted small">Watch step-by-step process on how to make a profile</p>
            </Col>
          </Row>

          <div className="mt-4" style={{ color: 'black' }}>
            {[
              { number: '02', title: 'Find Skills to Learn' },
              { number: '03', title: 'Connect and Learn' },
              { number: '04', title: 'Exchange Knowledge' },
              { number: '05', title: 'Review and Improve' },
            ].map((step, idx) => (
              <div
                key={idx}
                className="d-flex justify-content-between align-items-center py-3 border-bottom"
              >
                <div className="d-flex align-items-center gap-3">
                  <span className="fw-bold text-black fs-4">({step.number})</span>
                  <h6 className="mb-0">{step.title}</h6>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* --- Featured Classes Section --- */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-4">Featured Classes</h2>
          <Row className="align-items-center text-center text-md-start">
            <Col md={6}>
              <h5 className="fw-semibold">Explore Our Featured Classes</h5>
              <p className="fs-5 text-muted">Expand Your Skills from Anywhere!</p>
            </Col>
            <Col md={6}>
              <p className="text-muted">
                Our platform offers a diverse array of featured classes designed to empower you with practical skills and knowledge from the comfort of your own space.
              </p>
              <Button variant="dark" className="rounded-pill mt-2" onClick={() => navigate('/signup')}>Get Started</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* --- Why Choose Us Section --- */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center mb-4 mb-md-0">
              <img
                src="girl.jpeg"
                alt="Confused Girl Thinking"
                className="img-fluid rounded"
                style={{ maxWidth: '75%', height: 'auto' }}
              />
            </Col>
            <Col md={6}>
              <h5 className="fw-bold mb-3 border-bottom pb-2">Direct Skill Exchange</h5>
              <p>Connect with mentors who are passionate about sharing their expertise and helping you achieve your learning goals.</p>

              <h5 className="fw-bold mt-4 mb-3 border-bottom pb-2">Diverse Skill Categories</h5>
              <p>Explore a wide range of skills across categories such as Programming, Culinary Arts, Photography, Languages, and more.</p>

              <h5 className="fw-bold mt-4 mb-3 border-bottom pb-2">Flexible Learning</h5>
              <p>Learn at your own pace and schedule sessions that fit your lifestyle and availability.</p>

              <h5 className="fw-bold mt-4 mb-3 border-bottom pb-2">Community Engagement</h5>
              <p>Join discussions, forums, and workshops to collaborate with peers, share insights, and expand your network.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 text-center cta-section">
        <Container>
          <h4 className="mb-3">Ready to exchange skills and grow together</h4>
          <Button size="lg" onClick={() => navigate('/login')} style={{ width: '100px', height: '40px', padding: '4px 8px' }}>Join Now</Button>
        </Container>
      </section>

      <Footer />
    </>
  );
}
