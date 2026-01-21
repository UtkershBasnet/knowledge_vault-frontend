import axios from "axios";
import Constants from "expo-constants";
// Using local IP for physical device and simulator compatibility
const api = axios.create({
  baseURL:  "http://10.51.1.197:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
