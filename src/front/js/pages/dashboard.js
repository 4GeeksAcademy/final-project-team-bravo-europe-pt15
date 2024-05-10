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
  const [textToReplace, setTextToReplace] = useState(""); // State variable to hold the text to replace "prompt_text"
  const cloudName = "dcoocmssy";
  const backgroundRemoval = "/e_background_removal:fineedges_y/";
  const generativeRemove = "/e_gen_remove:";
  const generativeRestore = "/e_gen_restore,e_enhance/";
  const upscale = "/e_upscale"; //To use the upscale effect, the input image must be smaller than 0.25 megapixels (the equivalent of 625 x 400 pixels).
  // https://res.cloudinary.com/demo/image/upload/ar_1.0,c_fill,g_north_east,w_250/docs/camera.jpg
  // https://res.cloudinary.com/prod/image/upload/e_gen_remove:prompt_text/me/rm-signs-1.jpg
  // https://res.cloudinary.com/prod/image/upload/e_gen_replace:from_sweater;to_leather%20jacket%20with%20pockets/me/replace-apparel-4
  // https://res.cloudinary.com/prod/image/upload/e_upscale/me/upscale-sign-1

  // Function to handle image upload
  const handleImageUpload = async (url) => {
    setUploadedImage(url);
    setShowUploadButton(false); // Hide the UploadWidget button after successful upload
    setRetryCount(0); // Reset retry count when a new image is uploaded
  };

  // Function to construct the transformed image URL with background removal
  const getTransformedImageUrl = (originalUrl) => {
    return originalUrl.replace(/\/v\d+\//, `${upscale}${textToReplace}/`);
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
          setTimeout(checkTransformedImageAvailability, 3000); // Retry after 3 seconds
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

  // Function to handle text input change
  const handleTextChange = (event) => {
    setTextToReplace(event.target.value);
  };

  return (
    <div className="dashboard-container">
      <div className="image-container">
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
        <div className="center-content">
          {showUploadButton && (
            <UploadWidget onImageUpload={handleImageUpload} />
          )}
          {/* Input field for user to enter text */}
          <input
            type="text"
            value={textToReplace}
            onChange={handleTextChange}
            placeholder="Enter text to replace 'prompt_text'"
          />
        </div>
      </div>
      <div className="image-container">
        {transformedImage && (
          <>
            <h2>Transformed Image</h2>
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
