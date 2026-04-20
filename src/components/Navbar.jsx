import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import './Navbar.css';

const NavigationBar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Navbar 
      expand="lg" 
      variant="dark" 
      fixed="top" 
      className={`custom-navbar ${scrolled ? 'scrolled' : ''}`}
    >
      <Container fluid className="px-4 px-lg-5">
        <Navbar.Brand href="#home" className="fw-bold fs-3 text-primary-red d-flex align-items-center">
          <span className="logo-icon me-2">▶</span> MOVIEBOX
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto fw-medium fs-6">
            <Nav.Link href="#home" className="px-3">HOME</Nav.Link>
            <Nav.Link href="#movies-section" className="px-3">MOVIES</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center nav-icons">
            <span className="text-white-50 small d-none d-lg-block">
              <i className="bi bi-shield-lock-fill me-1 text-primary-red"></i> Private Vault
            </span>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
