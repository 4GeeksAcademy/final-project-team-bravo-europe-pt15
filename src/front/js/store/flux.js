const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      token: localStorage.getItem("token") || null,
      userId: localStorage.getItem("user_id") || null,
      username: localStorage.getItem("username") || null,
      isLoggedIn: !!localStorage.getItem("token"),
    },
    actions: {
      login: async (email, password) => {
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

          const data = await response.json();
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user_id);
          setStore({
            token: data.token,
            userId: data.user_id,
            isLoggedIn: true,
          });

          return true;
        } catch (error) {
          console.error("Error logging in:", error.message);
          return false;
        }
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        setStore({
          token: null,
          userId: null,
          username: null,
          isLoggedIn: false,
        });
      },
      checkAuth: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setStore({ isLoggedIn: false });
          return false;
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
          localStorage.setItem("username", data.username);
          setStore({
            token,
            userId: data.id,
            username: data.username,
            isLoggedIn: true,
          });

          return true;
        } catch (error) {
          console.error("Error fetching user details:", error);
          setStore({ isLoggedIn: false });
          return false;
        }
      },
    },
  };
};

export default getState;
