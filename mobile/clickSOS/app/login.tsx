import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../utils/authContext";
import Logo from "../assets/imgs/logo-click-og.svg";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

const apiURL = Constants.expoConfig?.extra?.API_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // link da api (atualmente rodando localhost)
      const response = await fetch(`${apiURL}/login`, {
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
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1 justify-center items-center p-6"
    >
      <StatusBar style="dark" />
      <View className="w-full p-6 rounded-2xl">
        <View className="flex-auto pb-10 justify-center items-center">
          <Logo width={280} height={100} />
          <Text>Um clique. Um alerta. <Text className="text-blue font-extrabold">Uma vida protegida.</Text></Text>
        </View>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
          placeholderTextColor="#6b7280"
        />

        <TextInput
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholderTextColor="#6b7280"
          secureTextEntry
          className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-6 w-full"
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
          <Text className="text-center">
            Não tem uma conta? <Text className="text-red font-semibold">Cadastre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
