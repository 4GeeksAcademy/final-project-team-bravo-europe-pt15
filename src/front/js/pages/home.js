import React, { useState } from "react";
import { Button, Card, Row, Col } from "react-bootstrap";
import "../../styles/home.css";
import { Box } from "../component/herosection";
import "../../styles/aifeatures.css";
import PartApiCont from "../component/partapi";
import ContactUs from "../component/contactus";
import VideoCard from "../component/video";

export const Home = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleShowVideo = (url) => {
    setVideoUrl(url);
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
    setVideoUrl("");
  };

  return (
    <div className="text-center mt-5">
      <Box />
      <div className="container">
        <Row className="m-auto align-self-center">
          <Col className="a">
            <Card
              style={{ width: "22.5rem", background: "rgba(24, 24, 28, 0.85)" }}
            >
              <Card.Body>
                <Card.Title style={{ color: "white" }}>Card Title 1</Card.Title>
                <Card.Text style={{ color: "white" }}>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button
                  className="frame"
                  variant="primary"
                  onClick={() =>
                    handleShowVideo(
                      "https://res.cloudinary.com/dcoocmssy/video/upload/v1715968139/Screencast_from_2024-05-15_18-50-33_dlihn4.mp4"
                    )
                  }
                >
                  Show example
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col className="a">
            <Card
              style={{ width: "22.5rem", background: "rgba(24, 24, 28, 0.85)" }}
            >
              
              <Card.Body>
                <Card.Title style={{ color: "white" }}>Card Title 2</Card.Title>
                <Card.Text style={{ color: "white" }}>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button
                  className="frame"
                  variant="primary"
                  onClick={() =>
                    handleShowVideo(
                      "https://res.cloudinary.com/dcoocmssy/video/upload/v1715968140/another_video_example.mp4"
                    )
                  }
                >
                  Show example
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div style={{ height: "55px" }}></div>
        <Row className="m-auto align-self-center">
          <Col className="a">
            <Card
              style={{ width: "22.5rem", background: "rgba(24, 24, 28, 0.85)" }}
            >
              
              <Card.Body>
                <Card.Title style={{ color: "white" }}>Card Title 3</Card.Title>
                <Card.Text style={{ color: "white" }}>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button
                  className="frame"
                  variant="primary"
                  onClick={() =>
                    handleShowVideo(
                      "https://res.cloudinary.com/dcoocmssy/video/upload/v1715968141/third_video_example.mp4"
                    )
                  }
                >
                  Show example
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col className="a">
            <Card
              style={{ width: "22.5rem", background: "rgba(24, 24, 28, 0.85)" }}
            >
              
              <Card.Body>
                <Card.Title style={{ color: "white" }}>Card Title 4</Card.Title>
                <Card.Text style={{ color: "white" }}>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button
                  className="frame"
                  variant="primary"
                  onClick={() =>
                    handleShowVideo(
                      "https://res.cloudinary.com/dcoocmssy/video/upload/v1715968142/fourth_video_example.mp4"
                    )
                  }
                >
                  Show example
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="container-fluid contact-us">
        <PartApiCont />
      </div>
      <div>
        <ContactUs />
      </div>
      <VideoCard
        show={showVideo}
        onHide={handleCloseVideo}
        videoUrl={videoUrl}
      />
    </div>
  );
};