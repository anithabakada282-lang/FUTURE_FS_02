import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // change if your backend runs on a different port
});

// Automatically add token to requests if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});

export default API;