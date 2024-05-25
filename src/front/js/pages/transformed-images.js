import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Context } from "../store/appContext"; // Assuming you have a context provider
import "../../styles/transformed-images.css";
import { downloadImage } from "../utils/imageDownload";

const TransformedImages = () => {
  const { store, actions } = useContext(Context);
  const [storedImages, setStoredImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      navigate("/");
      return;
    } else {
      fetchImages();
    }
  }, []);

  const fetchImages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/user/transformed-images`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transformed images");
      }

      const data = await response.json();
      setStoredImages(data.transformed_images);
    } catch (error) {
      console.error("Error fetching transformed images:", error);
      navigate("/");
    }
  };

  const handleDownloadImage = (url) => {
    downloadImage(url);
  };

  const handleDeleteImage = async (url) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/user/transformed-images`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }

      // Remove the deleted image from the local state
      setStoredImages(storedImages.filter((imageUrl) => imageUrl !== url));

      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "The image has been deleted.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the image. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="transformed-images-container">
      <h2>Transformed Images of {store.username}</h2>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      <div className="images-grid">
        {storedImages.length > 0 ? (
          storedImages.map((url, index) => (
            <div className="image-card" key={index}>
              <img src={url} alt={`Transformed ${index + 1}`} />
              <div className="image-card-buttons">
                <button
                  className="download-btn"
                  onClick={() => handleDownloadImage(url)}
                >
                  Download
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteImage(url)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No transformed images found</p>
        )}
      </div>
    </div>
  );
};

export default TransformedImages;
