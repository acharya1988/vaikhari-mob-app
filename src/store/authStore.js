import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set, get) => ({
  token: null,
  hydrated: false,

  setToken: async (token) => {
    if (!token) {
      console.warn("⚠️ No token provided to setToken");
      return;
    }
    await AsyncStorage.setItem("token", token);
    set({ token });
  },

  loadToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) set({ token });
    } finally {
      set({ hydrated: true });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null });
  },
}));
