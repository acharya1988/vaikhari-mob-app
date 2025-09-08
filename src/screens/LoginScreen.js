import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { login } from "../actions/authAction";
import { useAuthStore } from "../store/authStore";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const setToken = useAuthStore((state) => state.setToken);

const handleLogin = async () => {
    try {
      // Call API
      const res = await login({ email, password }); // returns { status, response }

      if (res.status && res.response?.data?.token) {
        const token = res.response.data.token;

        await setToken(token);
        navigation.replace("Dashboard");
      } else {
        alert(res.response?.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed due to network error");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Signup
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { color: "blue", marginTop: 10, textAlign: "center" },
});
