import React from "react";
import "../../styles/home.css";
import UploadWidget from "../component/UploadWidget";
import Login from "./login";

export const Home = () => {
  return (
    <div className="text-center mt-5">
      <h1>Image Upload</h1>
      <UploadWidget />
      <Login />
    </div>
  );
};
