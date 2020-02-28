import axios from "axios";

const api = axios.create({
  baseURL: "http://19:2.168.90.244:5123"
});

export default api;
