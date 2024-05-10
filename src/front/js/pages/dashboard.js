import React, { useState, useEffect } from "react";
import UploadWidget from "../component/UploadWidget";
import ImageSlider from "react-image-comparison-slider";
import "../../styles/dashboard.css";

export const Dashboard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [transformedImage, setTransformedImage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showUploadButton, setShowUploadButton] = useState(true);
  const [textToReplace, setTextToReplace] = useState("");
  const cloudName = "dcoocmssy";
  const upscale = "e_upscale";

  // Function to handle image upload
  const handleImageUpload = async (url) => {
    setUploadedImage(url);
    setShowUploadButton(false);
    setRetryCount(0);
  };

  // Function to construct the transformed image URL with upscale transformation
  const getTransformedImageUrl = (originalUrl) => {
    return `${originalUrl.replace(/\/upload\//, `/upload/${upscale}/`)}`;
  };

  // Function to check if the transformed image is available
  const checkTransformedImageAvailability = () => {
    fetch(getTransformedImageUrl(`${uploadedImage}`))
      .then((response) => {
        if (response.status === 200) {
          setTransformedImage(getTransformedImageUrl(`${uploadedImage}`));
        } else if (response.status === 423) {
          setTimeout(checkTransformedImageAvailability, 3000);
        } else {
          console.error("Error:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (uploadedImage) {
      checkTransformedImageAvailability();
    }
  }, [uploadedImage, retryCount]);

  // Function to handle text input change
  const handleTextChange = (event) => {
    setTextToReplace(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <div className="center-content">
        {showUploadButton && <UploadWidget onImageUpload={handleImageUpload} />}
        <input
          type="text"
          value={textToReplace}
          onChange={handleTextChange}
          placeholder="Enter text to replace 'prompt_text'"
        />
      </div>
      <div className="image-container">
        {uploadedImage && transformedImage && (
          <ImageSlider
            image1={`${uploadedImage}`}
            image2={`${transformedImage}`}
            sliderWidth={3}
            sliderColor="red"
            handleColor="red"
            handleBackgroundColor="white"
          />
        )}
        {uploadedImage && !transformedImage && (
          <p className="loading-message">Transforming image, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
