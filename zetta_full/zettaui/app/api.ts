import axios from "axios";

const api = axios.create({
  // baseURL: "http://zetta.test/api/v1", // LOCAL
  baseURL: "https://api.talkenoo.click/api/v1", // PROD
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

export default api;
