import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.29.82:5000/",
});

// AUTH
export const registerUser = (data) =>
  API.post("/register", data);

export const loginUser = (data) =>
  API.post("/login", data);

// TRANSACTIONS
export const getSummary = (token) =>
  API.get("/transactions/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  export const getFinancialHealth = (token) =>
  API.get("/financial-health", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getTransactions = (token) =>
  API.get("/transactions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const createTransaction = (data, token) =>
  API.post("/transactions", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export default API;