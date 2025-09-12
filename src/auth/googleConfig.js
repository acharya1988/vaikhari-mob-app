import Constants from 'expo-constants';
import googleServices from '../../google-services.json';

export function getGoogleWebClientId() {
  // Try extras first
  const extra = Constants?.expoConfig?.extra || {};
  if (extra.GOOGLE_WEB_CLIENT_ID) return extra.GOOGLE_WEB_CLIENT_ID;
  if (extra.GOOGLE_EXPO_CLIENT_ID) return extra.GOOGLE_EXPO_CLIENT_ID;

  // Fallback: read from google-services.json (client_type 3 is Web)
  try {
    const clients = googleServices?.client || [];
    for (const c of clients) {
      const list = c?.oauth_client || [];
      const web = list.find((o) => o.client_type === 3 && o.client_id);
      if (web?.client_id) return web.client_id;
    }
  } catch (e) {}
  return '';
}

export function getFirebaseApiKey() {
  const extra = Constants?.expoConfig?.extra || {};
  if (extra.FIREBASE_API_KEY) return extra.FIREBASE_API_KEY;
  try {
    const clients = googleServices?.client || [];
    for (const c of clients) {
      const key = c?.api_key?.[0]?.current_key;
      if (key) return key;
    }
  } catch (e) {}
  return '';
}

