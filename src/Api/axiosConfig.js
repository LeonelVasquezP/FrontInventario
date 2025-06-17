import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001/api", // Asegúrate de que el puerto coincida con el backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
