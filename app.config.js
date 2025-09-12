export default ({ config }) => ({
  ...config,
  extra: {
    // API_URL: process.env.API_URL || "http://192.168.1.100:5000/api",
    API_URL: "http://192.168.1.4:5000/api",
    // Firebase (set via env or inline)
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY || "",
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN || "",
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID || "",
    // Google OAuth client ids
    GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID || "",
    GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID || "",
    GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID || "",
    GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || "",
  
  },
});
