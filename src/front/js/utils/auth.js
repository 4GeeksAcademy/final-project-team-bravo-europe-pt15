import { useNavigate, useLocation } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (
        location.pathname === "/dashboard" ||
        location.pathname === "/transformed-images"
      ) {
        alert(
          "You have to be logged in to access this page. Click OK to login"
        );
      }
      navigate("/");
      return; // Navigate to login with alert for specific pages
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      localStorage.setItem("user_id", data.id);
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      navigate("/");
      throw error;
    }
  };

  return { checkAuth };
};
