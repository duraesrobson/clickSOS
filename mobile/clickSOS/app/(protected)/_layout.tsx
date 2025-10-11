import { Stack, Redirect } from "expo-router";
import { View, ActivityIndicator, Text } from "react-native";
import { useAuth } from "../../utils/authContext";

export default function ProtectedLayout() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="blue" />
        <Text className="mt-4 text-gray-600">Carregando...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
