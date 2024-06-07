import Swal from "sweetalert2";

export const loginUser = async (email, password, navigate) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.msg);
    }

    // Handle successful login
    const data = await response.json();
    const token = data.token;
    const user_id = data.user_id;

    // Store token in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", user_id);

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Wrong password or email",
      icon: "error",
      confirmButtonText: "OK",
    });
    console.error("Error logging in:", error.message);
  }
};
