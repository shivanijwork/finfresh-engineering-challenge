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

export const getBudgetHistory = (token) =>
  API.get(
    "/transactions/history",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getProfile = (token) =>
  API.get(
    "/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const updateProfile = (data, token) =>
  API.put(
    "/profile",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// TRANSACTIONS

export const getTransactions = (token, params = {}) =>
  API.get(
    "/transactions",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
      params,
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

export const updateTransaction = (id, data, token) =>
  API.put(
    `/transactions/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteTransaction = (id, token) =>
  API.delete(
    `/transactions/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export default API;