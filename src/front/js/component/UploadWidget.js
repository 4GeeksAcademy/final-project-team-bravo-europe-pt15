import React, { useEffect, useRef } from "react";
import "../../styles/UploadWidget.css";

const UploadWidget = ({ onImageUpload }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dcoocmssy",
        uploadPreset: "jsm_mafl",
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          onImageUpload(result.info.secure_url); // Pass the uploaded image URL back to the parent component
        }
      }
    );
  }, [onImageUpload]);

  return (
    <div id="upload-button-container">
      <button id="upload-button" onClick={() => widgetRef.current.open()}>
        <span id="text-color">Upload image here</span>
      </button>
    </div>
  );
};

export default UploadWidget;
