// src/pages/Dashboard.js
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
import PayPalCheckout from "../component/paypalCheckout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Initialize Cloudinary with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: "dcoocmssy",
  },
});

const Dashboard = () => {
  const [effect, setEffect] = useState(null);
  const [promptText, setPromptText] = useState(""); // Text for single prompt input
  const [prompt1, setPrompt1] = useState(""); // Text for first prompt input
  const [prompt2, setPrompt2] = useState(""); // Text for second prompt input
  const [showPrompt, setShowPrompt] = useState(false); // Flag to show single prompt input
  const [showPrompts, setShowPrompts] = useState(false); // Flag to show dual prompts input
  const [publicID, setPublicID] = useState(""); // Cloudinary public ID of the uploaded image
  const [appliedEffect, setAppliedEffect] = useState(null); // Effect that has been applied
  const [username, setUsername] = useState(""); // State to hold the username
  const [credits, setCredits] = useState(0); // State to hold user credits
  const [showPayPal, setShowPayPal] = useState(false); // Flag to show PayPal modal
  const navigate = useNavigate(); // Hook for navigation
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status

  // Check if user is authenticated when the component mounts
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token") !== null;
    if (!isAuthenticated) {
      navigate("/login");
      alert("You have to be logged in to access this page. Click OK to login");
    } else {
      // Fetch user details
      fetch(`${process.env.BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsername(data.username); // Update username state
          setCredits(data.credits); // Update credits state
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        });
    }
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // URLs for original and transformed images
  const originalImageURL = cld.image(publicID).toURL();
  const transformedImageURL = appliedEffect
    ? cld.image(publicID).effect(appliedEffect).toURL()
    : originalImageURL;

  // Extract public ID from uploaded image URL
  const handleImageUpload = (imageUrl) => {
    const regex = /\/v\d+\/(.+?)\.[^.]+$/;
    const match = imageUrl.match(regex);
    if (match && match.length > 1) {
      setPublicID(match[1]);
      setAppliedEffect(null);
    }
  };

  // Helper function for delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Retry logic for background removal request
  const retryRequest = async (url, retries = 5, delayTime = 3000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (response.status !== 423) {
          return response;
        }
        await delay(delayTime);
      } catch (error) {
        console.error("Error fetching the URL:", error);
      }
    }
    return null;
  };

  // Handle button clicks for various transformations
  const handleClick = async (button) => {
    switch (button) {
      case "removeBackground":
        setIsLoading(true); // Set loading state to true
        const url = cld.image(publicID).effect(backgroundRemoval()).toURL();
        const response = await retryRequest(url);
        setIsLoading(false); // Set loading state to false after response

        if (response && response.ok) {
          setEffect(backgroundRemoval());
          setShowPrompt(false);
          setShowPrompts(false);
        } else {
          alert(
            "Background removal is experiencing issues. Please try again later."
          );
        }
        break;

      case "removeObject":
        setEffect(generativeRemove());
        setShowPrompt(true);
        setShowPrompts(false);
        break;

      case "replaceObject":
        setEffect(generativeReplace());
        setShowPrompt(false);
        setShowPrompts(true);
        break;

      case "upscaleImage":
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
        if (effect) {
          if (credits > 0) {
            setIsLoading(true); // Set loading state to true
            if (showPrompt) {
              setEffect(effect.prompt(promptText));
            } else if (showPrompts) {
              setEffect(effect.from(prompt1).to(prompt2));
            }
            setAppliedEffect(effect);

            // Simulate API call to Cloudinary for effect application
            setTimeout(async () => {
              setShowPrompt(false);
              setShowPrompts(false);

              // Deduct one credit after transformation is complete
              const newCredits = credits - 1;
              setCredits(newCredits);

              // Update credits in the backend
              try {
                const response = await fetch(
                  `${process.env.BACKEND_URL}/api/user/credits`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ credits: newCredits }),
                  }
                );
                const data = await response.json();
                setCredits(data.credits); // Update credits state
                alert("Image processing complete. Credits have been deducted.");
              } catch (error) {
                console.error("Error updating user credits:", error);
              } finally {
                setIsLoading(false); // Set loading state to false after processing is done
              }
            }, 3000); // Simulate delay for processing
          } else {
            alert("You have no credits left. Please fill up your credits.");
          }
        } else {
          alert("Please select an effect to apply.");
        }
        break;

      case "credits":
        setShowPayPal(true);
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
      link.download = "transformed-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
      alert("Failed to download the image. Please try again.");
    }
  };

  const handlePayPalSuccess = (details) => {
    const newCredits = credits + 10; // 1 USD = 10 credits
    setCredits(newCredits);

    // Update credits in the backend
    fetch(`${process.env.BACKEND_URL}/api/user/credits`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ credits: newCredits }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCredits(data.credits); // Update credits state
      })
      .catch((error) => {
        console.error("Error updating user credits:", error);
      });

    setShowPayPal(false);
  };

  return (
    <div className="center">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing image, please wait...</p>
        </div>
      )}
      <div className={`operations-container ${isLoading ? "blurred" : ""}`}>
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
            <h4>{username ? `Welcome, ${username}` : "User options"}</h4>
            <button onClick={() => handleClick("credits")}>
              Available Credits <span className="badge">{credits}</span>
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
      {showPayPal && (
        <div className="paypal-modal-overlay">
          <PayPalScriptProvider
            options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}
          >
            <PayPalCheckout
              onClose={() => setShowPayPal(false)}
              onSuccess={handlePayPalSuccess}
            />
          </PayPalScriptProvider>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
