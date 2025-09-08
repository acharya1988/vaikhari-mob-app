import { apiRequest } from "../utils/apiRequest";
import { API_URLS } from "../api/apiUrls";

/**
 * Signup user
 { name, email, password }
 */
export const signup = async (data) => {
  const res = await apiRequest({
    endUrl: API_URLS.SIGNUP,
    method: "POST",
    body: data,
    showMsg: true, // show success/error toast
  });

  return res;
};

/**
 * Login user
 * { email, password }
 */
export const login = async (data) => {
console.log("data",data);
  console.log("rees",API_URLS.LOGIN)

  const res = await apiRequest({
    endUrl: API_URLS.LOGIN,
    method: "POST",
    body: data,
    showMsg: true,
  });

  console.log("reees",res)
  return res;
};
