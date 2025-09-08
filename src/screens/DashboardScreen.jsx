import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";

export default function DashboardScreen({ navigation }) {
  const { token, loadToken, logout } = useAuthStore();

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (!token) {
      navigation.replace("Login");
    }
  }, [token]);

  return (
    <View style={styles.container}>
      {token ? (
        <>
        <View>
          <Text style={styles.text}>Dashboard</Text>
          <Text style={styles.text}>Logged In</Text>
        </View>
          <Button
            title="Logout"
            onPress={async () => {
              await logout();
              navigation.replace("Login");
            }}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});
