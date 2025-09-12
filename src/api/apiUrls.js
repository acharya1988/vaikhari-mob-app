export const API_URLS = {
  // Session
  SESSION: "/session", // POST (web cookie), DELETE (sign out)

  // Auth / identity
  AUTH_ME: "/v1/auth/me",
  USERS_UPSERT: "/v1/users/upsert",

  // Signup flow
  RESERVE_HANDLE: "/v1/users/reserve-handle",
  USER_PROFILES: "/v1/user-profiles",
  COMPLETE_PROFILE: "/v1/users/complete-profile",

  // Account / MFA
  UPDATE_MY_PROFILE: "/v1/user-profiles/me",
  ENROLL_MFA: "/v1/users/mfa",
};
