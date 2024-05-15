import React, { useEffect, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  backgroundRemoval,
  generativeRemove,
  generativeReplace,
  upscale,
} from "@cloudinary/url-gen/actions/effect";
import UploadWidget from "../component/UploadWidget";
import ImageSlider from "react-image-comparison-slider";
import "../../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

// Initialize Cloudinary with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: "dcoocmssy",
  },
});

const Dashboard = () => {
  // State hooks for various application states
  const [effect, setEffect] = useState(upscale());
  const [promptText, setPromptText] = useState("");
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [publicID, setPublicID] = useState(""); // Store the public ID of the uploaded image
  const [appliedEffect, setAppliedEffect] = useState(null); // Track applied effect
  const navigate = useNavigate();

  // Check authentication status when the component mounts
  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem("token") !== null;

    // If the user is not authenticated, redirect to the login page
    if (!isAuthenticated) {
      navigate("/login");
      alert("You have to be loged in to access this page. Click OK to login");
    }
  }, [navigate]);

  // Function to handle logout
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Navigate to the login page
    navigate("/");
  };

  // URLs for original and transformed images
  const originalImageURL = cld.image(publicID).toURL();
  const transformedImageURL = appliedEffect
    ? cld.image(publicID).effect(appliedEffect).toURL()
    : originalImageURL;

  // Handle image upload and extract public ID
  const handleImageUpload = (imageUrl) => {
    console.log(imageUrl);
    const regex = /\/v\d+\/(.+?)\.[^.]+$/;
    const match = imageUrl.match(regex);
    if (match && match.length > 1) {
      setPublicID(match[1]);
      setAppliedEffect(null); // Reset applied effect when a new image is uploaded
    }
  };

  // Handle button clicks for various transformations
  const handleClick = (button) => {
    switch (button) {
      case "removeBackground":
        setEffect(backgroundRemoval());
        setShowPrompt(false);
        setShowPrompts(false);
        break;
      case "removeObject":
        setEffect(generativeRemove().prompt("text"));
        setShowPrompt(true);
        setShowPrompts(false);
        break;
      case "replaceObject":
        setEffect(generativeReplace().from("prompt1").to("prompt2"));
        setShowPrompt(false);
        setShowPrompts(true);
        break;
      case "upscaleImage":
        // Check if the image dimensions are suitable for upscaling
        if (originalImageURL) {
          const img = new Image();
          img.src = originalImageURL;
          img.onload = function () {
            const width = this.width;
            const height = this.height;
            if (width > 625 || height > 400) {
              alert(
                "The uploaded image is too big for upscaling. Maximum dimensions required: 625x400 pixels."
              );
            } else {
              setEffect(upscale());
              setShowPrompt(false);
              setShowPrompts(false);
            }
          };
          img.onerror = function () {
            console.error("Error loading image for upscaling.");
          };
        }
        break;
      case "applyChanges":
        if (showPrompt) {
          setEffect(effect.prompt(promptText));
        } else if (showPrompts) {
          setEffect(effect.from(prompt1).to(prompt2));
        }
        setAppliedEffect(effect);
        setShowPrompt(false);
        setShowPrompts(false);
        break;
      case "credits":
        // Logic for handling "Available Credits" button click
        break;
      default:
        break;
    }
  };

  // Handle image download
  const handleDownloadImage = async () => {
    if (!transformedImageURL) {
      alert("No transformed image available for download.");
      return;
    }

    try {
      const response = await fetch(transformedImageURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transformed-image.png"; // Set the desired file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  return (
    <div className="center">
      <div className="operations-container">
        <div className="command-container">
          <div className="upload-widget">
            <UploadWidget onImageUpload={handleImageUpload} />
            <p>Click here to upload image for transformation</p>
          </div>
          <div className="operations-buttons">
            <button onClick={() => handleClick("removeBackground")}>
              Remove Background
            </button>
            <button onClick={() => handleClick("removeObject")}>
              Remove object from image
            </button>
            <button onClick={() => handleClick("replaceObject")}>
              Replace object in image
            </button>
            <button onClick={() => handleClick("upscaleImage")}>
              Upscale image
            </button>
          </div>
          <div className="additional-options">
            <h4>Additional options</h4>
            {showPrompt && (
              <div className="prompt">
                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Object to remove from image"
                />
              </div>
            )}
            {showPrompts && (
              <div className="prompts">
                <input
                  type="text"
                  value={prompt1}
                  onChange={(e) => setPrompt1(e.target.value)}
                  placeholder="Object to remove"
                />
                <input
                  type="text"
                  value={prompt2}
                  onChange={(e) => setPrompt2(e.target.value)}
                  placeholder="Object to replace removed object"
                />
              </div>
            )}
            <button onClick={() => handleClick("applyChanges")}>
              Apply Changes
            </button>
          </div>
          <div className="user-options">
            <h4>User options</h4>
            <button onClick={() => handleClick("credits")}>
              Available Credits
            </button>
            {appliedEffect && (
              <button onClick={handleDownloadImage}>
                Download Transformed Image
              </button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div className="image-slider-container">
          <ImageSlider
            image1={originalImageURL}
            image2={transformedImageURL}
            leftLabelText="Transformed image"
            rightLabelText="Original image"
            showPlaceholder={true}
            customPlaceholder={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "top",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f0f0f0",
                  border: "2px dashed #ccc",
                  color: "#333",
                  fontSize: "1.2em",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Please upload your image to see possible transformations
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
