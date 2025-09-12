// CommonJS syntax + .env loading for Expo config
const fs = require('fs');
const path = require('path');

function loadEnv() {
  try {
    const p = path.resolve(__dirname, '.env');
    if (!fs.existsSync(p)) return {};
    const txt = fs.readFileSync(p, 'utf8');
    const out = {};
    for (const line of txt.split(/\r?\n/)) {
      if (!line || line.trim().startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      if (!(k in process.env)) process.env[k] = v; // expose for consumers
      out[k] = v;
    }
    return out;
  } catch (e) {
    return {};
  }
}

function getFirebaseApiKeyFromGoogleServices() {
  try {
    const gsPath = path.resolve(__dirname, 'google-services.json');
    if (!fs.existsSync(gsPath)) return '';
    const gs = JSON.parse(fs.readFileSync(gsPath, 'utf8'));
    const clients = gs?.client || [];
    for (const c of clients) {
      const key = c?.api_key?.[0]?.current_key;
      if (key) return key;
    }
  } catch (e) {}
  return '';
}

module.exports = ({ config }) => {
  const env = loadEnv();

  const API_URL = process.env.API_URL || env.API_URL || 'http://192.168.1.4:5000/api';
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || env.FIREBASE_API_KEY || getFirebaseApiKeyFromGoogleServices() || '';
  const FIREBASE_AUTH_DOMAIN = process.env.FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN || '';
  const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID || '';
  const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID || env.FIREBASE_APP_ID || '';

  const GOOGLE_EXPO_CLIENT_ID = process.env.GOOGLE_EXPO_CLIENT_ID || env.GOOGLE_EXPO_CLIENT_ID || env.GOOGLE_WEB_CLIENT_ID || '';
  const GOOGLE_ANDROID_CLIENT_ID = process.env.GOOGLE_ANDROID_CLIENT_ID || env.GOOGLE_ANDROID_CLIENT_ID || '';
  const GOOGLE_IOS_CLIENT_ID = process.env.GOOGLE_IOS_CLIENT_ID || env.GOOGLE_IOS_CLIENT_ID || '';
  const GOOGLE_WEB_CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID || env.GOOGLE_WEB_CLIENT_ID || '';

  return {
    ...config,
    extra: {
      API_URL,
      FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID,
      FIREBASE_APP_ID,
      GOOGLE_EXPO_CLIENT_ID,
      GOOGLE_ANDROID_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID,
      GOOGLE_WEB_CLIENT_ID,
    },
  };
};
