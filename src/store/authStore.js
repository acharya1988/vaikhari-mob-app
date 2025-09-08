import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
  token: null,

  setToken: async (token) => {
    if (!token) {
    console.warn("⚠️ No token provided to setToken");
    return;
  }
    await AsyncStorage.setItem("token", token);
    set({ token });
  },

  loadToken: async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) set({ token });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null });
  },
}));
