import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.90.244:5123"
});

export default api;
