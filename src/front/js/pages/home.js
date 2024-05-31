import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import VideoCard from "../component/video";
import "../../styles/home.css";
import Swal from "sweetalert2";

export const Home = () => {
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation check
    if (!email || !name || !message) {
      Swal.fire(
        "Error",
        "Please fill up all fields to get in touch with us",
        "error"
      );
      return;
    }

    const response = await fetch(
      `${process.env.BACKEND_URL}/api/send-contact-form`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, message }),
      }
    );

    if (response.ok) {
      Swal.fire("Success", "Message sent successfully!", "success");
      setEmail(""); // Clear form fields after successful submission
      setName("");
      setMessage("");
    } else {
      Swal.fire("Error", "Failed to send message.", "error");
    }
  };

  const videos = [
    "https://res.cloudinary.com/dcoocmssy/video/upload/v1716572625/mafl/lu4vrszysxcnt7s65epn.webm",
    "https://res.cloudinary.com/dfxwm93pu/video/upload/v1716573357/MAFL_-_ImageAlchemy_-_Google_Chrome_2024-05-24_19-48-19_j7zapv.mp4",
    "https://res.cloudinary.com/dfxwm93pu/video/upload/v1716574042/MAFL_-_ImageAlchemy_-_Google_Chrome_2024-05-24_20-04-34_qb7grb.mp4",
    "https://res.cloudinary.com/dcoocmssy/video/upload/v1716573869/mafl/wcpflrgpcvxtnoclljmu.webm",
  ];

  const cards = [
    {
      title: "Upscale",
      text: "Enhance the quality of images when upscaling them, making them clearer and sharper (maximum possible image size: 625 x 400 pixels).",
    },
    {
      title: "Background Removal",
      text: "Dynamically extracts the foreground subject in images while removing the background on the fly.",
    },
    {
      title: "Generative Remove",
      text: "Effortlessly eliminates unwanted objects, text, or user-defined regions from images.",
    },
    {
      title: "Generative Replace",
      text: "Replace objects within images with alternative objects or images, while maintaining a natural look.",
    },
  ];

  return (
    <div className="home">
      {/* Ellipses */}
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={`ellipse ellipse-${i + 1}`}></div>
      ))}
      <Container className="text-center hero">
        <h1>USING AI HAS NEVER BEEN THIS EASY</h1>
        <p>
          Editing and formatting photos and pictures has never been this easy!
        </p>
        <Button onClick={handleClick} className="gradient-button">
          Sign up Now
        </Button>
      </Container>
      <Container>
        <Row className="mt-5">
          {cards.map((card, index) => (
            <Col md={6} lg={3} className="mb-4" key={index}>
              <Card className="card-size custom-card">
                <Card.Body className="card-content">
                  <Card.Title>{card.title}</Card.Title>
                  <Card.Text>{card.text}</Card.Text>
                </Card.Body>
                <div className="button-wrapper">
                  <Button
                    className="gradient-button"
                    onClick={() => handleShowVideo(videos[index])}
                  >
                    Show example
                  </Button>
                </div>
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
        <Form className="contact-form" onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Your Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="btn-space" controlId="formMessage">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
