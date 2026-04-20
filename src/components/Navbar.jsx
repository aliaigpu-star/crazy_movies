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
            <Nav.Link href="#movies" className="px-3">MOVIES</Nav.Link>
            <Nav.Link href="#tv-shows" className="px-3">TV SHOWS</Nav.Link>
            <Nav.Link href="#audiobook" className="px-3">AUDIOBOOK</Nav.Link>
            <Nav.Link href="#blog" className="px-3">BLOG</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center nav-icons">
            <Nav.Link href="#search" className="text-white me-3 fs-5"><FaSearch /></Nav.Link>
            <Nav.Link href="#account" className="text-white fs-4"><FaUserCircle /></Nav.Link>
            <button className="btn btn-primary-red ms-3 d-none d-lg-block btn-sm px-3 py-1">Subscribe</button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
