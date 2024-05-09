// Dashboard.js

import React, { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import UploadWidget from "../component/UploadWidget";
import "../../styles/dashboard.css";

export const Dashboard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [transformedImage, setTransformedImage] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showUploadButton, setShowUploadButton] = useState(true); // State variable to control visibility of UploadWidget
  const cloudName = "dcoocmssy";

  // Function to handle image upload
  const handleImageUpload = async (url) => {
    setUploadedImage(url);
    setShowUploadButton(false); // Hide the UploadWidget button after successful upload
    setRetryCount(0); // Reset retry count when a new image is uploaded
  };

  // Function to construct the transformed image URL with background removal
  const getTransformedImageUrl = (originalUrl) => {
    return originalUrl.replace(
      /\/v\d+\//,
      "/e_background_removal:fineedges_y/"
    );
  };

  // Function to check if the transformed image is available
  const checkTransformedImageAvailability = () => {
    fetch(getTransformedImageUrl(uploadedImage))
      .then((response) => {
        if (response.status === 200) {
          // Transformed image is available
          setTransformedImage(getTransformedImageUrl(uploadedImage));
        } else if (response.status === 423) {
          // Transformed image is not yet available, retry after a delay
          setTimeout(checkTransformedImageAvailability, 5000); // Retry after 3 seconds
        } else {
          // Handle other errors
          console.error("Error:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // Check for transformed image availability when uploadedImage changes
    if (uploadedImage) {
      checkTransformedImageAvailability();
    }
  }, [uploadedImage, retryCount]); // Re-run effect when uploadedImage or retryCount changes

  return (
    <div className="dashboard-container">
      <div className="image-container center-content">
        {" "}
        {/* Apply center-content class here */}
        {showUploadButton && <UploadWidget onImageUpload={handleImageUpload} />}
        {uploadedImage && (
          <>
            <h2>Original Image</h2>
            <div className="image-wrapper">
              <Image
                cloudName={cloudName}
                publicId={uploadedImage}
                width="500"
              />
            </div>
          </>
        )}
      </div>
      <div className="image-container">
        {transformedImage && (
          <>
            <h2>Transformed Image (Background Removed)</h2>
            <div className="image-wrapper">
              <Image
                cloudName={cloudName}
                publicId={transformedImage}
                width="500"
              />
            </div>
          </>
        )}
        {uploadedImage && !transformedImage && (
          <p className="loading-message">Transforming image, please wait...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
