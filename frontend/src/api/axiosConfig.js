import axios from "axios";

const api = axios.create({
  baseURL: `http://${window.location.hostname}:8080`,
});

export default api;