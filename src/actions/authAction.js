import { apiRequest } from "../utils/apiRequest";
import { API_URLS } from "../api/apiUrls";

/**
 * Web only: Exchange Firebase idToken for secure cookie
 * { idToken }
 */
export const exchangeSession = async ({ idToken }) => {
  return apiRequest({
    endUrl: API_URLS.SESSION,
    method: "POST",
    body: { idToken },
    showMsg: false,
  });
};

/**
 * Upsert user on sign-in (idempotent)
 * headers: Authorization: Bearer <idToken>
 * body: { uid, email, providerIds }
 */
export const upsertUser = async ({ uid, email, providerIds, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.USERS_UPSERT,
    method: "POST",
    body: { uid, email, providerIds },
    savedToken: idToken,
  });
};

/**
 * Fetch current user profile
 * headers: Authorization: Bearer <idToken>
 */
export const getMe = async ({ idToken } = {}) => {
  return apiRequest({
    endUrl: API_URLS.AUTH_ME,
    method: "GET",
    savedToken: idToken,
  });
};

/**
 * Reserve a unique handle
 * body: { handle }
 */
export const reserveHandle = async ({ handle, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.RESERVE_HANDLE,
    method: "POST",
    body: { handle },
    savedToken: idToken,
    showMsg: true,
  });
};

/**
 * Create the profile record (self, auth)
 * body: { ...profileFields }
 */
export const createUserProfile = async ({ profile, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.USER_PROFILES,
    method: "POST",
    body: profile,
    savedToken: idToken,
    showMsg: true,
  });
};

/**
 * Finalize profile: name, handle, role
 * body: { name, handle, role }
 */
export const completeProfile = async ({ name, handle, role, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.COMPLETE_PROFILE,
    method: "POST",
    body: { name, handle, role },
    savedToken: idToken,
    showMsg: true,
  });
};

/**
 * Update my profile (auth)
 */
export const updateMyProfile = async ({ updates, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.UPDATE_MY_PROFILE,
    method: "PATCH",
    body: updates,
    savedToken: idToken,
    showMsg: true,
  });
};

/**
 * Enroll MFA and set phone (auth)
 * body: { phone }
 */
export const enrollMfa = async ({ phone, idToken }) => {
  return apiRequest({
    endUrl: API_URLS.ENROLL_MFA,
    method: "POST",
    body: { phone },
    savedToken: idToken,
    showMsg: true,
  });
};

/**
 * Sign out (clears cookie if web; for mobile we just clear local token)
 */
export const signOutSession = async () => {
  return apiRequest({
    endUrl: API_URLS.SESSION,
    method: "DELETE",
    token: false, // cookie-based
    showMsg: false,
  });
};
