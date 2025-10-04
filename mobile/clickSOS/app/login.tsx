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
import { API_URL } from "@env";
import Logo from "../assets/imgs/logo-click-og.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // link da api (atualmente rodando localhost)
      const response = await fetch(`${API_URL}/login`, {
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
      Alert.alert("Erro", `Não foi possível conectar ao backend. Erro: ${error}`);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-6">
      <View className="bg-white w-full p-6 rounded-2xl shadow-lg">
        <View className="flex-auto pb-4 justify-center items-center">
          <Logo width={250} height={100} />
        </View>

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
          className="bg-blue py-3 rounded-xl"
        >
          <Text className="text-white text-center font-semibold text-lg">
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/cadastro")}
          className="mt-4"
        >
          <Text className="text-red text-center font-semibold">
            Não tem uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
