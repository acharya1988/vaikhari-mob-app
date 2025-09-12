export default ({ config }) => ({
  ...config,
  "plugins": [
    "expo-font",
    "expo-web-browser"
  ],
  extra: {
    API_URL: process.env.API_URL || "http://192.168.1.100:5000/api",
  },
});
