import Constants from 'expo-constants';
import { getFirebaseApiKey } from './googleConfig';

const { FIREBASE_API_KEY: FB_KEY_EXTRA } = (Constants?.expoConfig?.extra || {});
const FIREBASE_API_KEY = FB_KEY_EXTRA || getFirebaseApiKey();

const IDENTITY_BASE = 'https://identitytoolkit.googleapis.com/v1';

async function postIdentity(path, body) {
  if (!FIREBASE_API_KEY) {
    throw new Error('Missing FIREBASE_API_KEY in app.config.js extra');
  }
  const url = `${IDENTITY_BASE}${path}?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || 'Firebase auth error';
    throw new Error(msg);
  }
  return data;
}

export async function signInWithEmailPassword(email, password) {
  const data = await postIdentity('/accounts:signInWithPassword', {
    email,
    password,
    returnSecureToken: true,
  });
  // data: idToken, refreshToken, localId, email
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    uid: data.localId,
    email: data.email,
    providerIds: ['password'],
  };
}

export async function createUserWithEmailPassword(email, password) {
  const data = await postIdentity('/accounts:signUp', {
    email,
    password,
    returnSecureToken: true,
  });
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    uid: data.localId,
    email: data.email,
    providerIds: ['password'],
  };
}

export async function signOut() {
  // No-op for REST; caller should clear local state/token.
  return true;
}

// Exchange a Google ID token for Firebase credentials via Identity Toolkit
export async function signInWithGoogleIdToken(googleIdToken) {
  if (!FIREBASE_API_KEY) {
    throw new Error('Missing FIREBASE_API_KEY in app.config.js extra');
  }
  const url = `${IDENTITY_BASE}/accounts:signInWithIdp?key=${encodeURIComponent(FIREBASE_API_KEY)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postBody: `id_token=${googleIdToken}&providerId=google.com`,
      requestUri: 'http://localhost',
      returnSecureToken: true,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || 'Firebase Google sign-in error';
    throw new Error(msg);
  }
  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    uid: data.localId,
    email: data.email,
    providerIds: ['google.com'],
  };
}
