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
    <div className="upload-button-container">
      <button
        className="upload-button"
        onClick={() => widgetRef.current.open()}
      >
        <span className="plus-sign"></span>
      </button>
      {/* <p className="mt-2">Press button to upload image</p> */}
    </div>
  );
};

export default UploadWidget;
