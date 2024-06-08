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
import Swal from "sweetalert2";
import "../../styles/dashboard.css";
import "../../styles/imagePlaceholder.css";
import { useNavigate } from "react-router-dom";
import PayPalCheckout from "../component/paypalCheckout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useAuth } from "../utils/auth";
import { delay, retryRequest } from "../utils/retryUtilis"; // Import the new retry utility

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
  const [instructionText, setInstructionText] = useState(
    "Please upload an image to enable transformations"
  );
  const [storedImages, setStoredImages] = useState([]);
  const { checkAuth } = useAuth(); // Use the new auth.js utility
  const [showModal, setShowModal] = useState(false); // State to show or hide the modal
  const closePayPalModal = () => {
    setShowPayPal(false);
    setShowModal(false); // Reset showModal state
  };

  // Check if user is authenticated when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      navigate("/");
      return;
    } else {
      fetchUserDetails();
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const data = await checkAuth();
      setUsername(data.username); // Update username state
      setCredits(data.credits); // Update credits state

      const response = await fetch(
        `${process.env.BACKEND_URL}/api/user/transformed-images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
      const imageData = await response.json();
      setStoredImages(imageData.transformed_images); // Update stored images state
    } catch (error) {
      console.error("Error fetching user details or images:", error);
    }
  };

  // URLs for original and transformed images
  const originalImageURL = publicID ? cld.image(publicID).toURL() : "";
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
      setInstructionText("Choose a transformation to apply to your image");
    }
  };

  // Handle button clicks for various transformations
  const handleClick = async (button) => {
    setShowModal(true); // Show the modal when a button is clicked
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
          Swal.fire({
            title: "Error!",
            text: "Background removal is experiencing issues. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          }).then(() => {
            setEffect(null); // Disable the effect
            setShowModal(false); // Close the modal
          });
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
              setShowModal(false);
              Swal.fire({
                title: "Error!",
                text: "The uploaded image is too big for upscaling. Maximum dimensions required: 625x400 pixels.",
                icon: "error",
                confirmButtonText: "OK",
              });
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
            setIsLoading(true);
            if (showPrompt) {
              setEffect(effect.prompt(promptText));
            } else if (showPrompts) {
              setEffect(effect.from(prompt1).to(prompt2));
            }
            setAppliedEffect(effect);

            setTimeout(async () => {
              setShowPrompt(false);
              setShowPrompts(false);

              const newCredits = credits - 1;
              setCredits(newCredits);

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
                setCredits(data.credits);

                // Store the transformed image URL in the backend
                const transformedImage = cld
                  .image(publicID)
                  .effect(effect)
                  .toURL();
                await fetch(
                  `${process.env.BACKEND_URL}/api/user/transformed-images`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      user_id: data.id,
                      url: transformedImage,
                    }),
                  }
                );

                // Update the stored images state
                setStoredImages((prevImages) => [
                  ...prevImages,
                  transformedImage,
                ]);

                Swal.fire({
                  title: "Success!",
                  text: "Image processing complete. Credits have been deducted.",
                  icon: "success",
                  confirmButtonText: "OK",
                }).then(() => {
                  setShowModal(false); // Close the modal after SweetAlert
                });
              } catch (error) {
                console.error(
                  "Error updating user credits or storing the image:",
                  error
                );
              } finally {
                setIsLoading(false);
              }
            }, 5000);
          } else {
            Swal.fire({
              title: "Error!",
              text: "You have no credits left. Please fill up your credits.",
              icon: "error",
              confirmButtonText: "OK",
            });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Please select an effect to apply.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        break;

      case "credits":
        setShowPayPal(true);
        break;

      default:
        break;
    }
  };

  const handlePayPalSuccess = (details, amount) => {
    const paidAmount = parseFloat(amount);
    const newCredits = credits + paidAmount * 10; // Calculate credits based on amount paid

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
    setShowModal(false); // Reset showModal state
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
          <div className="user-options">
            <h4>{username ? `Welcome, ${username}` : "User options"}</h4>
            <button onClick={() => handleClick("credits")}>
              Available Credits <span className="badge">{credits}</span>
            </button>
            <button onClick={() => navigate("/transformed-images")}>
              Transformed Images
              <span className="badge">{storedImages.length}</span>
            </button>
            <div className="upload-widget">
              <UploadWidget onImageUpload={handleImageUpload} />
            </div>
          </div>
          <div className="operations-buttons">
            <p>{instructionText}</p>
            <div className="tooltip-container">
              <button
                onClick={() => handleClick("removeBackground")}
                disabled={!publicID}
              >
                Remove Background
              </button>
              {publicID && (
                <span className="tooltip-text">
                  Dynamically extracts the foreground subject in images while
                  removing the background on the fly.
                </span>
              )}
            </div>
            <div className="tooltip-container">
              <button
                onClick={() => handleClick("removeObject")}
                disabled={!publicID}
              >
                Remove object from image
              </button>
              {publicID && (
                <span className="tooltip-text">
                  Effortlessly eliminates unwanted objects, text, or
                  user-defined regions from images.
                </span>
              )}
            </div>
            <div className="tooltip-container">
              <button
                onClick={() => handleClick("replaceObject")}
                disabled={!publicID}
              >
                Replace object in image
              </button>
              {publicID && (
                <span className="tooltip-text">
                  Replace objects within images with alternative objects or
                  images, while maintaining a natural look.
                </span>
              )}
            </div>
            <div className="tooltip-container">
              <button
                onClick={() => handleClick("upscaleImage")}
                disabled={!publicID}
              >
                Upscale image
              </button>
              {publicID && (
                <span className="tooltip-text">
                  Enhance the quality of images when upscaling them, making them
                  clearer and sharper (maximum possible image size: 625 x 400
                  pixels).
                </span>
              )}
            </div>
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="close-modal-btn" onClick={closePayPalModal}>
                  X
                </button>
                <div className="additional-options">
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
              </div>
            </div>
          )}
        </div>
        {showPayPal && (
          <div className="paypal-modal-overlay">
            <PayPalScriptProvider
              options={{ "client-id": process.env.PAYPAL_CLIENT_ID }}
            >
              <PayPalCheckout
                onClose={closePayPalModal} // Use the new function to close PayPal modal
                onSuccess={(details, amount) =>
                  handlePayPalSuccess(details, amount)
                }
              />
            </PayPalScriptProvider>
          </div>
        )}

        <div className="image-slider-container">
          <ImageSlider
            image1={originalImageURL}
            image2={transformedImageURL}
            leftLabelText="Transformed image"
            rightLabelText="Original image"
            showPlaceholder={true}
            customPlaceholder={
              <div className="custom-placeholder">
                Please upload your image first
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
