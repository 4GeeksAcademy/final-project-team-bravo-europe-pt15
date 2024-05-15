import React, { useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  backgroundRemoval,
  generativeRemove,
  generativeReplace,
} from "@cloudinary/url-gen/actions/effect";
import UploadWidget from "../component/UploadWidget";
import { upscale } from "@cloudinary/url-gen/actions/effect";
import ImageSlider from "react-image-comparison-slider";
import "../../styles/operations.css";

const cld = new Cloudinary({
  cloud: {
    cloudName: "dcoocmssy",
  },
});

const Operations = () => {
  const [effect, setEffect] = useState(upscale());
  const [promptText, setPromptText] = useState("");
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [publicID, setPublicID] = useState(""); // State to store the public ID
  const [appliedEffect, setAppliedEffect] = useState(null); // State to track applied effect

  const originalImageURL = cld.image(publicID).toURL();

  const transformedImageURL = appliedEffect
    ? cld.image(publicID).effect(appliedEffect).toURL()
    : originalImageURL;

  const handleImageUpload = (imageUrl) => {
    console.log(imageUrl);
    // Extracting public ID from the uploaded image URL
    const regex = /\/v\d+\/(.+?)\.[^.]+$/;
    const match = imageUrl.match(regex);
    if (match && match.length > 1) {
      setPublicID(match[1]);
      setAppliedEffect(null); // Reset applied effect when a new image is uploaded
    }
  };

  const handleClick = async (button) => {
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
        if (originalImageURL) {
          const img = new Image();
          img.src = originalImageURL;
          img.onload = function () {
            const width = this.width;
            const height = this.height;
            if (width > 625 || height > 400) {
              alert(
                "The uploaded image is too small for upscaling. Minimum dimensions required: 625x400 pixels."
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
            <button onClick={() => handleClick("credits")}>
              Available Credits
            </button>
            {appliedEffect && (
              <button onClick={handleDownloadImage}>
                Download Transformed Image
              </button>
            )}
          </div>
        </div>
        <div className="image-slider-container">
          <ImageSlider
            image1={transformedImageURL}
            image2={originalImageURL}
            leftLabelText="Original image"
            rightLabelText="Transformed image"
          />
        </div>
      </div>
    </div>
  );
};

export default Operations;
