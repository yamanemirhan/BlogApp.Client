import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://localhost:7270/api",
  withCredentials: true,
});
