import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { useAuth } from "../../utils/authContext";
import { API_URL } from "@env";
export default function Alertar() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDispararAlerta = async () => {
    if (!token) {
      Alert.alert("Erro", "Você não está autenticado.");
      return;
    }

    setLoading(true);

    try {
      // Pede permissão de localização
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada.");
        setLoading(false);
        return;
      }

      // Pega a posição atual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Faz o POST no backend
      const response = await fetch(`${API_URL}/alertas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (!response.ok) {
        const msg = await response.text();
        Alert.alert("Erro", msg);
        setLoading(false);
        return;
      }

      Alert.alert("Sucesso", "Alerta enviado com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível conectar ao backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-blue-600 mb-4">ALERTAR!!!!</Text>

      <TouchableOpacity
        onPress={handleDispararAlerta}
        className="bg-green-600 px-6 py-3 rounded-xl mb-4"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold">Disparar Alerta</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
