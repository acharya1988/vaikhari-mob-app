import { showMessage, _toastVariants } from "./toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { triggerTokenExpire } from "./tokenHelper";

const { API_URL } = Constants.expoConfig.extra;

/**
 * Build headers based on type
 */
function getRequestHeaders(type = "json") {
  let headers = {};
  switch (type) {
    case "json":
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      break;
    case "form":
      headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      };
      break;
    default:
      headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      };
      break;
  }
  return headers;
}

/**
 * Convert query or params object to string
 */
function createQueryOrParams(object, type = "query") {
  if (!object || typeof object !== "object") return "";

  const entries = Object.entries(object);
  if (!entries.length) return "";

  if (type === "query") {
    return (
      "?" +
      entries
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&")
    );
  } else if (type === "params") {
    return "/" + entries.map(([_, value]) => encodeURIComponent(value)).join("/");
  }

  return "";
}

/**
 * Main API request function
 */
export const apiRequest = async ({
  endUrl,
  method = "GET",
  headerType = "json",
  body = null,
  query = null,
  params = null,
  token = true,
  savedToken = null,
  showMsg = false,
}) => {
  try {
    let headers = getRequestHeaders(headerType);

    // Add token if available
    if (savedToken) {
      headers.Authorization = `Bearer ${savedToken}`;
    } else if (token) {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) headers.Authorization = `Bearer ${storedToken}`;
    }

    // Add params to URL
    if (params) endUrl += createQueryOrParams(params, "params");

    // Add query string
    if (query) endUrl += createQueryOrParams(query, "query");

    // Full URL

    const url = API_URL + endUrl;
    console.log("urls",url);

    // Fetch options
    const options = {
      method,
      headers,
      body: headerType === "json" && body ? JSON.stringify(body) : body,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    // Token expired
    if (response.status === 401 || response.status === 498) {
      triggerTokenExpire();
      showMessage({ message: "Session expired. Please login again.", variant: _toastVariants.Error });
      return { status: false, response: data };
    }

    // Success or failure
    const status = response.status >= 200 && response.status < 300;
    if (showMsg) {
      showMessage({
        message: data.message || (status ? "Success" : "Something went wrong"),
        variant: status ? _toastVariants.Success : _toastVariants.Error,
      });
    }

    return { status, response: data };
  } catch (e) {
    if (showMsg) {
      showMessage({ message: e.toString(), variant: _toastVariants.Error });
    }
    return { status: false, response: {}, message: e.toString() };
  }
};

export { createQueryOrParams };
