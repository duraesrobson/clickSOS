// mobile/clickSOS/app/(protected)/(tabs)/index.tsx (ATUALIZADO)

import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../utils/authContext";
import InfoCard from "../../../components/InfoCard";
import { FontAwesome } from "@expo/vector-icons";

export default function Home() {
  const { logout } = useAuth();

  // NOTE: Se você estiver usando Expo Router, substitua o comentário pelas funções de navegação:
  // const router = useRouter(); 
  const handleNavigateToAlert = () => { /* Navegar para a aba Alertar */ };
  const handleNavigateToProfile = () => { /* Navegar para a aba Perfil */ };


  return (
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 p-4 mt-11">
        <StatusBar style="dark" />

        {/* BOAS-VINDAS E ÍCONE */}
        <View className="pt-8 pb-6 px-2 items-center">
          <FontAwesome name="shield" size={48} color="#1e6ba5" className="mb-2" />
          <Text className="text-3xl font-bold text-[#1e6ba5] mb-1">ClickSOS</Text>
          <Text className="text-gray-600 text-base">Sua segurança, simplificada.</Text>
        </View>

        {/* 🟢 Card 1: REFORÇO DA FUNÇÃO PRINCIPAL (Alerta) */}
        <InfoCard title="Ação Rápida (SOS)" iconName="rocket" iconColor="#db2b39">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Como disparar o seu Alerta:
          </Text>

          <View className="mb-3 border-b border-gray-200 pb-3">
            <Text className="font-bold text-gray-700">1. Pelo Aplicativo</Text>
            <Text className="text-sm text-gray-600">
              Vá para a aba **Alerta** e pressione o botão SOS na tela.
            </Text>
          </View>

          {/* 💡 Novo Bloco de Informação do ESP32 */}
          <View className="bg-red-50 p-3 rounded-lg border border-red-200">
            <Text className="font-bold text-[#db2b39] flex-row items-center">
              <FontAwesome name="microchip" size={14} color="#db2b39" /> {" "}
              2. Pelo Botão Remoto (ESP32)
            </Text>
            <Text className="text-sm text-gray-700 mt-1">
              Seu botão físico de emergência também está pronto. Ao ser pressionado,
              ele envia um comando para o app buscar e enviar sua **localização atual**.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleNavigateToAlert}
            className="mt-4 bg-[#db2b39] p-3 rounded-xl"
          >
            <Text className="text-white font-bold text-center">IR PARA O SOS DO APP</Text>
          </TouchableOpacity>
        </InfoCard>

        {/* Card 2: STATUS RÁPIDO DO CADASTRO */}
        <InfoCard title="Requisitos Essenciais" iconName="list-ul" iconColor="#1e6ba5">
          <Text className="text-sm text-gray-700 leading-6">
            Para o alerta funcionar:
            <Text className="font-bold"> 1)</Text> Permissão de localização ativa.
            <Text className="font-bold"> 2)</Text> Pelo menos um contato de emergência cadastrado.
          </Text>
          <TouchableOpacity
            onPress={handleNavigateToProfile}
            className="mt-4 bg-gray-200 p-3 rounded-xl border border-gray-300"
          >
            <Text className="text-[#1e6ba5] font-semibold text-center">Ver/Editar Contatos</Text>
          </TouchableOpacity>
        </InfoCard>
      </ScrollView>
    </LinearGradient>
  );
}