import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import UploadWidget from "../component/UploadWidget";

export const Home = () => {
  const { store, actions } = useContext(Context);

  return (
    <div className="text-center mt-5">
      <h1>Image Upload</h1>
      <UploadWidget />
    </div>
  );
};
