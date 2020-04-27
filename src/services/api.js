import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5123",
});

export default api;

// baseURL: "http://192.168.90.244:5123"
