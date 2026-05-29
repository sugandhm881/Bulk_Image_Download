import axios from "axios";

// In production (Vercel) set VITE_API_URL=/api so requests hit the
// Python serverless function. Locally it defaults to the dev backend,
// which also serves routes under /api.
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const API = axios.create({
  baseURL,
});

export default API;
