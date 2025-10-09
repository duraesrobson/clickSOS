import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../utils/authContext";
import InfoCard from "../../../components/InfoCard";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Logo from '../../../assets/imgs/logo-click-og.svg'

export default function Home() {

  const handleNavigateToAlert = () => { /* colocar navegacao */ };
  const handleNavigateToProfile = () => { /* colocar navegacao */ };

  return (
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 p-4 mt-11" showsVerticalScrollIndicator={false}>
        <StatusBar style="dark" />

        {/* BOAS-VINDAS E ÍCONE */}
        <View className="pt-8 pb-6 px-2 items-center">
          <Logo width={250} height={60} />
          <Text className="text-gray-800 text-base">Sua segurança, simplificada.</Text>
        </View>

        {/* 🟢 Card 1: REFORÇO DA FUNÇÃO PRINCIPAL (Alerta) */}
        <InfoCard title="Ação Rápida (SOS)" >
          <Text className="text-base font-semibold mb-2">
            Como disparar o seu Alerta:
          </Text>

          <View className="bg-red-50 p-3 mb-3 border-b border-gray-200 rounded-lg ">
            <Text className="font-bold text-[#db2b39] flex-row items-center">
              <FontAwesome5 name="mobile" size={14} color="#db2b39" /> {" "}
              1. Pelo Aplicativo
            </Text>
            <Text className="text-sm mt-1">
              Vá para a aba Alertar e pressione o botão SOS na tela.
            </Text>
          </View>
          {/* 💡 Novo Bloco de Informação do ESP32 */}
          <View className="bg-red-50 p-3 mb-3 border-b border-gray-200 rounded-lg ">
            <Text className="font-bold text-[#db2b39] flex-row items-center">
              <FontAwesome5 name="microchip" size={14} color="#db2b39" /> {" "}
              2. Pelo Botão Remoto (ESP32)
            </Text>
            <Text className="text-sm mt-1">
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
          <Text className="text-sm leading-6">
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
        <View className="h-20" />
      </ScrollView>
    </LinearGradient>
  );
}