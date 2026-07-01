import axios from "axios";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.29.82:5000",
});

API.interceptors.request.use((config) => {
  console.log("API →", (config.baseURL || "") + config.url, config.data);
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API ✗", err?.config?.url, err?.message, err?.response?.status);
    return Promise.reject(err);
  }
);

// AUTH
export const registerUser = (data) =>
  API.post("/register", data);

export const loginUser = (data) =>
  API.post("/login", data);

// DASHBOARD

export const getSummary = (token) =>
  API.get(
    "/transactions/summary",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

export const getFinancialHealth = (token) =>
  API.get(
    "/transactions/financial-health",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

// TRANSACTIONS

export const getTransactions = (token) =>
  API.get(
    "/transactions",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

export const createTransaction =
(
data,
token
)=>

API.post(
"/transactions",
data,
{
headers:{
Authorization:
`Bearer ${token}`,
},
}
);

export default API;