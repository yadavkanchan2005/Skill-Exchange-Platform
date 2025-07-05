// import React from 'react';
// import { Navbar, Nav, Button, Container } from 'react-bootstrap';
// import { Link as RouterLink } from 'react-router-dom';

// function HeaderNavbar() {
//     return (
//         <Navbar expand="lg" style={{ backgroundColor: '#107279' }} variant="dark" fixed="top">
//             <Container>
//                 <Navbar.Brand href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
//                     Skill Exchange
//                 </Navbar.Brand>
//                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
//                 <Navbar.Collapse id="basic-navbar-nav">
//                     <Nav className="ms-auto align-items-center">
//                         <Nav.Link href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Nav.Link>
//                         <Nav.Link href="/about-us" style={{ color: 'white', marginRight: '1rem' }}> About Us</Nav.Link>
//                         <Nav.Link href="/contact-us" style={{ color: 'white', marginRight: '1rem' }}>Contact Us</Nav.Link>
//                         <Nav.Link href="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Nav.Link>
//                         <RouterLink to="/signup">
//                             <Button
//                                 variant="light"
//                                 style={{
//                                     borderRadius: '20px',
//                                     fontWeight: 'bold',
//                                     padding: '4px 16px',
//                                 }}
//                             >
//                                 Sign Up
//                             </Button>
//                         </RouterLink>
//                     </Nav>
//                 </Navbar.Collapse>
//             </Container>
//         </Navbar>
//     );
// }

// export default HeaderNavbar;




import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link as RouterLink } from 'react-router-dom';

function HeaderNavbar() {
    // ✅ Check login status
    const isLoggedIn = !!localStorage.getItem("token"); // or use 'token' or whatever key you use

    return (
        <Navbar expand="lg" style={{ backgroundColor: '#107279' }} variant="dark" fixed="top">
            <Container>
                <Navbar.Brand href="/" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                    Skill Exchange
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto align-items-center">
                        <Nav.Link href="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Nav.Link>
                        <Nav.Link href="/about-us" style={{ color: 'white', marginRight: '1rem' }}>About Us</Nav.Link>
                        <Nav.Link href="/contact-us" style={{ color: 'white', marginRight: '1rem' }}>Contact Us</Nav.Link>

                        {/* 👇 Conditional Rendering */}
                        {isLoggedIn ? (
                            <Nav.Link href="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>
                                Dashboard
                            </Nav.Link>
                        ) : (
                            <>
                                <Nav.Link href="/login" style={{ color: 'white', marginRight: '1rem' }}>
                                    Login
                                </Nav.Link>
                                <RouterLink to="/signup">
                                    <Button
                                        variant="light"
                                        style={{
                                            borderRadius: '20px',
                                            fontWeight: 'bold',
                                            padding: '4px 16px',
                                        }}
                                    >
                                        Sign Up
                                    </Button>
                                </RouterLink>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default HeaderNavbar;
