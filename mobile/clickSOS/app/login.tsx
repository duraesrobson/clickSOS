import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./utils/authContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // link da api (atualmente rodando localhost)
      const response = await fetch("http://192.168.126.218:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const msg = await response.text();
        Alert.alert("Erro", msg);
        return;
      }

      const data = await response.json();
      await login(data.token);
      router.replace("/(protected)");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível conectar ao backend.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <View className="bg-white w-full p-6 rounded-2xl shadow-lg">
        <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
          ClickSOS
        </Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
        />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          className="border border-gray-300 rounded-xl p-3 mb-6 w-full"
        />

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-blue-600 py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
