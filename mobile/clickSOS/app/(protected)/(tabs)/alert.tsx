import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../utils/authContext";
import { API_URL } from "@env";
import InfoCard from "../../../components/InfoCard";
import Icon from "../../../assets/imgs/iconsvg.svg"

export default function Alertar() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false); 
  const [alertSent, setAlertSent] = useState(false);
  const [locationText, setLocationText] = useState("Buscando localização..."); 
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false); // loader para a busca de localização

  // funcao para busca de localizacao
  const fetchLocation = async () => {
    setLocationLoading(true);
    setLocationText("Buscando endereço...");

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationText("Permissão de localização negada");
        return;
      }

      // obtém as coordenadas
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setCoords({ latitude, longitude });
      
      // converte as coordenadas em endereço legível (Geocodificação Reversa)
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (geocode.length > 0) {
        const address = geocode[0];
        // fallback para a cidade caso nao encontre a primeira opcao
        const cidade = address.city || address.subregion || '';
        
        // cria o texto do endereço no formato RUA, NÚMERO - CIDADE, ESTADO
        const formattedAddress = 
          `${address.street || 'Rua Desconhecida'}, ${address.streetNumber || 'S/N'}` +
          ` - ${cidade}, ${address.region}`;
          
        setLocationText(formattedAddress);
      } else {
        // fallback para Lat/Long se a geocodificação falhar
        setLocationText(`Lat: ${latitude.toFixed(5)}, Long: ${longitude.toFixed(5)} (Endereço indisponível)`);
      }

    } catch (err) {
      console.log("Erro ao obter localização:", err);
      setLocationText("Erro ao obter localização");
    } finally {
      setLocationLoading(false); // desativa o loader
    }
  };


  // chama a funcao de busca ao montar a tela
  useEffect(() => {
    fetchLocation();
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
        // se a localização ainda não foi carregada, tenta buscar uma vez antes de enviar
        const location = await Location.getCurrentPositionAsync({});
        latitude = location.coords.latitude;
        longitude = location.coords.longitude;
        setCoords({ latitude, longitude });
        
        // Opcional: Atualiza a tela com Lat/Long se a busca for feita aqui
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

      // faz o POST no backend (USANDO APENAS LATITUDE E LONGITUDE)
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
          <Text className="text-3xl font-bold text-red mb-2">Alerta de Emergência</Text>
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
            >
              {loading ? (
                <View className="w-44 h-44 rounded-full items-center justify-center bg-red shadow-2xl">
                  <ActivityIndicator size="large" color="#fdf0d5" />
                </View>
              ) : alertSent ? (
                <View className="w-44 h-44 rounded-full items-center justify-center bg-blue shadow-2xl">
                  <Text className="text-white text-xl font-bold">ENVIADO</Text>
                </View>
              ) : (
                <View className="justify-center items-center">
                  <Text className="font-bold text-red">Clique aqui!</Text>
                  <Icon width={250} height={250}/>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* LOCALIZAÇÃO (Usando o InfoCard) */}
          <InfoCard title="Sua Localização">
            {locationLoading ? (
                // loader enquanto a localização é buscada
                <ActivityIndicator size="small" color="#1e6ba5" className="my-2" />
            ) : (
                // texto de localização (endereço ou erro)
                <Text className="text-sm">{locationText}</Text>
            )}

            {/* botão para tentar buscar novamente */}
            <TouchableOpacity
                onPress={fetchLocation}
                disabled={locationLoading || loading}
                className={`mt-4 p-3 rounded-xl ${locationLoading ? 'bg-gray-300' : 'bg-[#1e6ba5]'}`}
            >
                <Text className="text-white font-semibold text-center">
                {locationLoading ? 'Atualizando...' : 'Atualizar Localização'}
                </Text>
            </TouchableOpacity>

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
            <Text className="text-sm leading-6">
              Ao pressionar o botão SOS, um alerta será enviado imediatamente para todos os seus contatos de emergência
              cadastrados, incluindo sua localização atual em tempo real.
            </Text>
          </InfoCard>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}