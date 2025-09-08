import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { signup } from "../actions/authAction";
import { useAuthStore } from "../store/authStore";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const data = await signup({ name, email, password });
      alert("Signup Successful");
      navigation.replace("Dashboard");

    } catch (err) {
      console.log(err);
      alert("Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Signup" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  link: { color: "blue", marginTop: 10, textAlign: "center" },
});
