import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      alert("You have to be logged in to access this page. Click OK to login");
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      localStorage.setItem("user_id", data.id);
      return data;
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  return { checkAuth };
};
