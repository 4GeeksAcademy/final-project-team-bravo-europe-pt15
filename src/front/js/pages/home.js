import React from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh" }}>
      <Container className="text-center hero" style={{ padding: "100px 0" }}>
        <h1>USING AI HAS NEVER BEEN THAT EASY</h1>
        <p>
          Editing, transcribing, and formatting texts and photos were never that
          easy!
        </p>
        <Button
          onClick={handleClick}
          variant="primary"
          style={{
            background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
            border: "none",
          }}
        >
          Sign up Now
        </Button>
      </Container>
      <Container>
        <Row className="mt-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Col md={6} lg={3} className="mb-4" key={index}>
              <Card style={{ backgroundColor: "#1c1c1e", color: "#fff" }}>
                <Card.Body>
                  <Card.Title>Card Title {index + 1}</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <Button
                    variant="primary"
                    style={{
                      background:
                        "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
                      border: "none",
                    }}
                  >
                    Show example
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Container
        className="text-center my-5"
        style={{ backgroundColor: "#1c1c1e", padding: "50px 0" }}
      >
        <h2>API's we partner with</h2>
        <img
          src="https://res.cloudinary.com/cloudinary/image/upload/v1614289360/cloudinary_logo_for_white_bg.svg"
          alt="Cloudinary Logo"
          style={{ width: "200px" }}
        />
      </Container>
      <Container className="text-center my-5">
        <h2>Get In Touch</h2>
        <p>
          MAFL would love to hear your opinion and know how we can improve our
          services.
        </p>
        <Form
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            backgroundColor: "#1c1c1e",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Form.Group controlId="formEmail">
            <Form.Label>Your Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>
          <Form.Group controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your message"
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            style={{
              background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
              border: "none",
            }}
          >
            Get In Touch
          </Button>
        </Form>
      </Container>
    </div>
  );
};
