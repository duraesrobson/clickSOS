import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";

function CustomTabBarButton({ children, onPress}: BottomTabBarButtonProps) {
  const isFocused = useIsFocused(); // identifica se o botão está ativo

  return (
    <Pressable onPress={onPress} style={styles.buttonContainer}>
      <View
        style={[
          styles.button,
          {
            backgroundColor: "#db2b39",
            borderWidth: 3,
            borderColor: isFocused ? "#fdf0d5" : "transparent",
            elevation: isFocused ? 5 : 0,
          }, // muda a cor ao clicar
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#db2b39",
        tabBarInactiveTintColor: "#fdf0d5",
        tabBarStyle: { backgroundColor: "#1e6ba5", height: 60 },
        tabBarLabelStyle: { fontSize: 10, color: "#fdf0d5" },
        headerStyle: { backgroundColor: "#1e6ba5" },
        headerTintColor: "#fdf0d5",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Início",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          headerShown: false,
          title: "Alertar",
          tabBarIcon: () => (
            <FontAwesome
              name="warning"
              size={28}
              color="#fdf0d5"
            />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          headerShown: false,
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
