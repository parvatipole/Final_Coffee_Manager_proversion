// Utility to clear all authentication data and start fresh
export const clearAllAuthData = () => {
  console.log("Clearing all authentication data...");

  // Clear all auth-related localStorage items
  localStorage.removeItem("coffee_auth_token");
  localStorage.removeItem("coffee_auth_user");
  localStorage.removeItem("registeredUsers");

  // Clear any other auth-related data
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.includes("auth") || key.includes("token") || key.includes("user"))
    ) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log("Authentication data cleared successfully");
};

// Add to window for debugging
if (typeof window !== "undefined") {
  (window as any).clearAuthData = clearAllAuthData;
}
