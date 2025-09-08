import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { showMessage } from "../utils/toast"
import { triggerTokenExpire } from "../utils/tokenHelper";

const { API_URL } = Constants.expoConfig.extra;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to request headers
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401 || status === 498) {
      triggerTokenExpire();
      showMessage({ message: "Session expired. Please login again.", variant: "error" });
    } else {
      showMessage({ message, variant: "error" });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
