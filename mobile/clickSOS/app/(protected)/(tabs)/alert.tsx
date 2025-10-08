import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../utils/authContext";
import { API_URL } from "@env";
import InfoCard from "../../../components/InfoCard";

export default function Alertar() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [locationText, setLocationText] = useState("Obtendo localização...");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // obtém a localização automaticamente ao entrar na tela
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationText("Permissão de localização negada");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setCoords({ latitude, longitude });
        setLocationText(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
      } catch (err) {
        console.log("Erro ao obter localização inicial:", err);
        setLocationText("Erro ao obter localização");
      }
    };

    getLocation();
  }, []);

  // botão SOS envia localização
  const handleDispararAlerta = async () => {
    if (!token) {
      Alert.alert("Erro", "Você não está autenticado.");
      return;
    }

    setLoading(true);

    try {
      // tenta usar a localização existente ou busca uma nova se necessário
      let latitude = coords?.latitude;
      let longitude = coords?.longitude;

      if (!latitude || !longitude) {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        setCoords({ latitude, longitude });
        setLocationText(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
      }

      // verifica se a localização foi obtida com sucesso
      if (!latitude || !longitude) {
        Alert.alert("Erro de Localização", "Não foi possível obter sua localização para enviar o alerta.");
        setLoading(false);
        return;
      }

      // feedback tátil
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // faz o POST no backend
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
        Alert.alert("Erro", msg || "Erro desconhecido ao enviar alerta.");
        setLoading(false);
        return;
      }

      // sucesso e feedback
      setAlertSent(true);

      setTimeout(() => {
        setAlertSent(false);
      }, 3000);

      Alert.alert("Sucesso", "Alerta enviado com sucesso!");
    } catch (error) {
      console.log("Erro no envio do alerta:", error);
      Alert.alert("Erro", "Não foi possível conectar ao backend ou houve falha na requisição.");
    } finally {
      // garante que o loading para se o alerta falhar
      if (!alertSent) {
        setLoading(false);
      }
    }
  };

  return (
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 50, paddingTop: 50, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="pt-12 pb-6 px-6 w-full items-center">
          <Text className="text-3xl font-bold text-[#db2b39] mb-2">Alerta de Emergência</Text>
          <Text className="text-gray-700 text-base">Pressione o botão em caso de emergência</Text>
        </View>

        {/* BODY */}
        <View className="flex-1 justify-center items-center px-6 w-full">
          {/* BOTÃO SOS */}
          <View className="items-center p-6">
            <TouchableOpacity
              onPress={handleDispararAlerta}
              disabled={loading || alertSent}
              // activeOpacity garante que o botão "afunde" ao ser clicado
              activeOpacity={0.7}
              className={`w-44 h-44 rounded-full items-center justify-center shadow-2xl ${alertSent ? "bg-blue" : "bg-red"
                }`}
            >
              {loading ? (
                <ActivityIndicator size="large" color="#fdf0d5" />
              ) : alertSent ? (
                <View>
                  <Text className="text-white text-xl font-bold">ENVIADO</Text>
                </View>
              ) : (
                <Text className="text-white text-3xl font-bold">SOS</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* LOCALIZAÇÃO (Usando o InfoCard) */}
          <InfoCard title="Sua Localização">
            <Text className="text-gray-600 text-base">{locationText}</Text>
            {alertSent && (
              <View className="mt-4 bg-green-100 rounded-2xl p-4">
                <Text className="text-green-600 font-bold text-center">
                  ✓ Alerta enviado para seus contatos de emergência!
                </Text>
              </View>
            )}
          </InfoCard>

          {/* INSTRUÇÕES (Usando o InfoCard) */}
          <InfoCard title="Como funciona:">
            <Text className="text-gray-700 text-sm leading-6">
              Ao pressionar o botão SOS, um alerta será enviado imediatamente para todos os seus contatos de emergência
              cadastrados, incluindo sua localização atual em tempo real.
            </Text>
          </InfoCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}