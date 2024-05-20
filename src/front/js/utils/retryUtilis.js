// Helper function for delay in handleClick function in dashboard.js

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry logic for background removal request
export const retryRequest = async (url, retries = 5, delayTime = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status !== 423) {
        return response;
      }
      await delay(delayTime);
    } catch (error) {
      console.error("Error fetching the URL:", error);
    }
  }
  return null;
};
