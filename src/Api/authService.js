import axios from "./axiosConfig";

export const registerUser = async (email, password) => {
  return axios.post("/auth/register", { email, password });
};

export const loginUser = async (email, password) => {
  return axios.post("/auth/signIn", { email, password });
};
