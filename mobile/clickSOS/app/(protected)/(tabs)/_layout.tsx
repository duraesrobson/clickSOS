import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";

function CustomTabBarButton({ children, onPress }: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <View style={styles.button}>{children}</View>
    </TouchableOpacity>
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
    backgroundColor: "#DC2626", 
    justifyContent: "center",
    alignItems: "center",
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0ea5e9",
        tabBarStyle: { backgroundColor: "#f9fafb", height: 70, },
        tabBarLabelStyle: {
          fontSize: 12,
          color: "black"
        },
        headerStyle: { backgroundColor: "#2563eb" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alert"
        options={{
          title: "Alertar",
          tabBarIcon: () => (
            <FontAwesome name="warning" size={26} color="#fff" />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
