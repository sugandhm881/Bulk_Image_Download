import axios from "axios";

// Set VITE_API_URL in the deploy environment (e.g. Vercel) to your backend URL.
// Falls back to the local backend during development.
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API = axios.create({
  baseURL,
});

export default API;
