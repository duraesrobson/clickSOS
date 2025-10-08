import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Animated, ScrollView } from "react-native";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../utils/authContext";
import { API_URL } from "@env";

export default function Alertar() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [locationText, setLocationText] = useState("Obtendo localização...");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // 🔹 Obtém a localização automaticamente ao entrar na tela
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
        console.log(err);
        setLocationText("Erro ao obter localização");
      }
    };

    getLocation();
  }, []);

  // 🔹 Animação pulsante
  useEffect(() => {
    if (!alertSent) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [alertSent]);

  // 🔹 Botão SOS envia localização
  const handleDispararAlerta = async () => {
    if (!token) {
      Alert.alert("Erro", "Você não está autenticado.");
      return;
    }

    setLoading(true);

    try {
      // Se ainda não tiver localização, tenta buscar
      let latitude = coords?.latitude;
      let longitude = coords?.longitude;

      if (!latitude || !longitude) {
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        setCoords({ latitude, longitude });
        setLocationText(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)}`);
      }

      // Feedback tátil
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Animação de clique
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();

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

      setAlertSent(true);
      Animated.timing(successAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

      setTimeout(() => {
        Animated.timing(successAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() =>
          setAlertSent(false)
        );
      }, 3000);

      Alert.alert("Sucesso", "Alerta enviado com sucesso!");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível conectar ao backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <StatusBar style="light" />

      <ScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40}}
      showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="pt-12 pb-6 px-6 rounded-b-3xl">
          <Text className="text-3xl font-bold text-white mb-2">Alerta de Emergência</Text>
          <Text className="text-white/90 text-base">Pressione o botão em caso de emergência</Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          {/* BOTÃO SOS */}
          <View className="items-center mb-12">
            {!alertSent && (
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  position: "absolute",
                  width: 280,
                  height: 280,
                  borderRadius: 140,
                  backgroundColor: "#db2b39",
                  opacity: 0.2,
                }}
              />
            )}

            <TouchableOpacity
              onPress={handleDispararAlerta}
              disabled={loading || alertSent}
              activeOpacity={0.8}
            >
              <Animated.View
                style={{ transform: [{ scale: scaleAnim }] }}
                className={`w-64 h-64 rounded-full items-center justify-center shadow-2xl ${
                  alertSent ? "bg-gray-600/40" : "bg-[#db2b39]"
                }`}
              >
                {loading ? (
                  <ActivityIndicator size="large" color="#fdf0d5" />
                ) : alertSent ? (
                  <Animated.View style={{ opacity: successAnim }}>
                    <Text className="text-white text-2xl font-bold mt-4">ENVIADO</Text>
                  </Animated.View>
                ) : (
                  <Text className="text-white text-2xl font-bold mt-4">SOS</Text>
                )}
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* LOCALIZAÇÃO */}
          <View className="bg-white rounded-3xl p-6 w-full shadow-lg">
            <View className="flex-row items-center mb-3">
              <Text className="text-lg font-bold text-[#1e6ba5] ml-3">Sua Localização</Text>
            </View>
            <Text className="text-gray-600 text-base">{locationText}</Text>

            {alertSent && (
              <Animated.View style={{ opacity: successAnim }} className="mt-4 bg-green-100 rounded-2xl p-4">
                <Text className="text-green-600 font-bold text-center">
                  ✓ Alerta enviado para seus contatos de emergência!
                </Text>
              </Animated.View>
            )}
          </View>

          {/* INSTRUÇÕES */}
          <View className="mt-8 bg-white rounded-3xl p-6 w-full shadow-lg">
            <Text className="text-base font-bold text-[#1e6ba5] mb-3">Como funciona:</Text>
            <Text className="text-gray-700 text-sm leading-6">
              Ao pressionar o botão SOS, um alerta será enviado imediatamente para todos os seus contatos de emergência
              cadastrados, incluindo sua localização atual em tempo real.
            </Text>
          </View>

          {/* BOTÃO SAIR */}
          <TouchableOpacity
            onPress={logout}
            className="mt-8 bg-red-600 px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
