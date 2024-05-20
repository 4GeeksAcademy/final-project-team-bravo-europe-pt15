import React from "react";
import {
  Modal,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

export const VideoCard = ({ show, onHide, videoUrl }) => (
  <Modal
    open={show}
    onClose={onHide}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    BackdropProps={{
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Optional: To add a semi-transparent dark background
        backdropFilter: 'blur(5px)',  // Adjust the blur amount as needed
      }
    }}
  >
    <Card style={{ maxWidth: 600 }}>
      <CardMedia>
        <video autoPlay muted loop width="100%" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </CardMedia>
      <CardContent>
        <Typography variant="h6" component="div">
          Video Title
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Video description goes here. This is a sample video inside a card.
        </Typography>
      </CardContent>
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onHide} variant="contained" color="primary">
          Close
        </Button>
      </Box>
    </Card>
  </Modal>
);

export default VideoCard;
