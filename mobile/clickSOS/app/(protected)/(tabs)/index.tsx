import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../utils/authContext";

export default function Index() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-blue-600 mb-4">
        Bem-vindo ao ClickSOS 🚨
      </Text>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
