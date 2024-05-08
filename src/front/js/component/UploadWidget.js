import React, { useEffect, useRef } from "react";
import "../../styles/UploadWidget.css";

const UploadWidget = () => {
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
        console.log(result);
      }
    );
  }, []);

  return (
    <div className="upload-button-container">
      <button
        className="upload-button"
        onClick={() => widgetRef.current.open()}
      >
        <span className="plus-sign"></span>
      </button>
      <p className="mt-2">Press button to upload image</p>
    </div>
  );
};

export default UploadWidget;
