import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import './PricingSection.css';

const PricingSection = () => {
  const plans = [
    {
      name: "Basic",
      price: "9.99",
      features: ["720p Resolution", "1 Device", "Limited Movies", "Ad-supported"],
      highlight: false
    },
    {
      name: "Standard",
      price: "3.99",
      features: ["1080p Resolution", "2 Devices", "All Movies & Shows", "No Ads"],
      highlight: true,
      badge: "SAVE 60%"
    },
    {
      name: "Premium",
      price: "6.99",
      features: ["4K + HDR", "4 Devices", "Full Library + Early Access", "No Ads"],
      highlight: false
    }
  ];

  return (
    <section className="pricing-section py-5 reveal">
      <Container className="py-lg-5">
        <div className="text-center mb-5">
          <h6 className="text-primary-red text-uppercase fw-bold mb-1">Subscription</h6>
          <h2 className="fw-bold display-5">Ready to Grab the Deal?</h2>
        </div>

        <Row className="justify-content-center align-items-center g-4">
          {plans.map((plan, index) => (
            <Col lg={4} md={6} key={index}>
              <Card className={`pricing-card text-center border-0 rounded-4 ${plan.highlight ? 'highlight' : 'bg-card'}`}>
                {plan.badge && <div className="pricing-badge">{plan.badge}</div>}
                <Card.Body className="p-5">
                  <h3 className="fw-bold mb-4">{plan.name}</h3>
                  <div className="price-tag mb-4">
                    <span className="currency fs-4">$</span>
                    <span className="amount display-4 fw-bold">{plan.price}</span>
                    <span className="period text-muted">/month</span>
                  </div>
                  
                  <ul className="list-unstyled mb-5 text-start">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="mb-3 d-flex align-items-center">
                        <FaCheckCircle className={`${plan.highlight ? 'text-white' : 'text-primary-red'} me-2`} />
                        <span className={plan.highlight ? 'text-white' : 'text-dark'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className={`w-100 py-3 fw-bold ${plan.highlight ? 'btn-light text-danger' : 'btn-primary-red'}`}>
                    GET THE DEAL
                  </Button>
                  <p className="mt-3 small text-muted mb-0">30 days money back guarantee</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default PricingSection;
