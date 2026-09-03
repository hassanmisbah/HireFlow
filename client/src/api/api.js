import axios from "axios";

const api = axios.create({
  baseURL: "https://hire-flow-gules-six.vercel.app/api",
});

export default api;