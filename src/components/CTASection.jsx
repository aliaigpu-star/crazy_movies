import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './CTASection.css';

const CTASection = () => {
  return (
    <section className="cta-section py-5 reveal">
      <Container className="py-5 text-center">
        <Row className="justify-content-center">
          <Col lg={8}>
            <h2 className="display-4 fw-bold mb-3">Start for your first 30 days.</h2>
            <p className="lead mb-5 text-white-50">Ready to watch? Enter your email to create or reset your membership.</p>
            
            <Form className="cta-form d-flex flex-column flex-md-row gap-2 justify-content-center mx-auto" style={{maxWidth: '700px'}}>
              <Form.Control 
                type="email" 
                placeholder="Email address" 
                className="py-3 px-4 bg-dark text-white border-white-50 rounded-1"
                style={{flex: '1'}}
              />
              <Button variant="danger" className="btn-primary-red py-3 px-5 fw-bold fs-5 rounded-1 border-0">
                GET STARTED
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CTASection;
