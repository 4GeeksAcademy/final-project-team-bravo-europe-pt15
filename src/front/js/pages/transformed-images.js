import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/transformed-images.css";

const TransformedImages = () => {
  const [storedImages, setStoredImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token || !userId) {
      // Redirect to login if not authenticated
      navigate("/login");
      return;
    }

    const fetchImages = async () => {
      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/user/transformed-images?user_id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Handle the case where the response is not ok (e.g., unauthorized)
          throw new Error("Failed to fetch transformed images");
        }

        const data = await response.json();
        setStoredImages(data.transformed_images);
      } catch (error) {
        console.error("Error fetching transformed images:", error);
        // Redirect to login if there's an error fetching images (e.g., token expired)
        navigate("/login");
      }
    };

    fetchImages();
  }, [navigate]);

  return (
    <div className="transformed-images-container">
      <h2>Transformed Images</h2>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      <div className="images-grid">
        {storedImages.length > 0 ? (
          storedImages.map((url, index) => (
            <div className="image-card" key={index}>
              <img src={url} alt={`Transformed ${index + 1}`} />
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
