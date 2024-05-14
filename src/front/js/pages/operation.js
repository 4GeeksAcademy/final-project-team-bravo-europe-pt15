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

// Create a Cloudinary instance and set your cloud name.
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
  const publicID = "mafl/yetlwb6tdjb830pp276g";

  const originalImageURL = cld.image(publicID).toURL();
  const transformedImageURL = cld.image(publicID).effect(effect).toURL();

  const handleClick = (button) => {
    switch (button) {
      case "removeBackground":
        setEffect(backgroundRemoval());
        break;
      case "removeObject":
        setEffect(generativeRemove().prompt("text"));
        setShowPrompt(true);
        break;
      case "replaceObject":
        setEffect(generativeReplace().from("prompt1").to("prompt2"));
        setShowPrompts(true);
        break;
      case "upscaleImage":
        setEffect(upscale());
        break;
      case "credits":
        // Logic for handling "Available Credits" button click
        break;
      default:
        break;
    }
  };

  const handlePromptSubmit = () => {
    setEffect(effect.prompt(promptText));
    setShowPrompt(false);
  };

  const handlePromptsSubmit = () => {
    setEffect(effect.from(prompt1).to(prompt2));
    setShowPrompts(false);
  };

  return (
    <div className="center">
      <div className="operations-container">
        <div className="command-container">
          <UploadWidget />
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
          <button onClick={() => handleClick("credits")}>
            Available Credits
          </button>
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
      {showPrompt && (
        <div className="prompt">
          <input
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
          />
          <button onClick={handlePromptSubmit}>Submit</button>
        </div>
      )}
      {showPrompts && (
        <div className="prompts">
          <input
            type="text"
            value={prompt1}
            onChange={(e) => setPrompt1(e.target.value)}
          />
          <input
            type="text"
            value={prompt2}
            onChange={(e) => setPrompt2(e.target.value)}
          />
          <button onClick={handlePromptsSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Operations;
