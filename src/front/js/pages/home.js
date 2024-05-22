import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VideoCard from "../component/video";
import "../../styles/home.css";

export const Home = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleClick = () => {
    navigate("/signup");
  };

  const handleShowVideo = (url) => {
    setVideoUrl(url);
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setVideoUrl("");
  };

  const videos = [
    "https://demo-res.cloudinary.com/video/upload/c_pad,h_400,w_711,b_blurred:1000/w_400/ang_dub_vertical.webm",
    "https://demo-res.cloudinary.com/video/upload/c_pad,h_400,w_711,b_blurred:1000/w_400/ang_dub_vertical.webm",
    "https://demo-res.cloudinary.com/video/upload/c_pad,h_400,w_711,b_blurred:1000/w_400/ang_dub_vertical.webm",
    "https://demo-res.cloudinary.com/video/upload/c_pad,h_400,w_711,b_blurred:1000/w_400/ang_dub_vertical.webm",
  ];

  return (
    
    <div className="home">
      {/* Ellipses */}
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={`ellipse ellipse-${i + 1}`}></div>
      ))}
      <Container className="text-center hero">
        <h1>USING AI HAS NEVER BEEN THAT EASY</h1>
        <p>
          Editing, transcribing, and formatting texts and photos were never that
          easy!
        </p>
        <Button onClick={handleClick} className="gradient-button">
          Sign up Now
        </Button>
      </Container>
      <Container>
        <Row className="mt-5">
          {videos.map((videoUrl, index) => (
            <Col md={6} lg={3} className="mb-4" key={index}>
              <Card className="custom-card">
                <Card.Body>
                  <Card.Title>Card Title {index + 1}</Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </Card.Text>
                  <Button
                    className="gradient-button"
                    onClick={() => handleShowVideo(videoUrl)}
                  >
                    Show example
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      <Container className="text-center my-5 api-section">
        <h2>API's we partner with</h2>
        <img
          src="https://res.cloudinary.com/cloudinary/image/upload/v1614289360/cloudinary_logo_for_white_bg.svg"
          alt="Cloudinary Logo"
          className="api-logo"
        />
      </Container>
      <Container className="text-center my-5 contact-section">
        <h2>Get In Touch</h2>
        <p>
          MAFL would love to hear your opinion and know how we can improve our
          services.
        </p>
        <Form className="contact-form">
          <Form.Group controlId="formEmail">
            <Form.Label>Your Email</Form.Label>
            <Form.Control type="email" placeholder="Enter your email" />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your name" />
          </Form.Group>
          <Form.Group className="btn-space" controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control 
              as="textarea"
              rows={3}
              placeholder="Enter your message"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="gradient-button">
            Get In Touch
          </Button>
        </Form>
      </Container>
      <VideoCard
        show={showVideo}
        onHide={handleCloseVideo}
        videoUrl={videoUrl}
      />
    </div>
  );
};
