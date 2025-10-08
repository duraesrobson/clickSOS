import type { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { View, StyleSheet, Pressable } from "react-native";

function CustomTabBarButton({ children, onPress }: BottomTabBarButtonProps) {
  return (
    <Pressable onPress={onPress} 
      style={styles.buttonContainer}>
      <View style={styles.button}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    top: -30,
    color: "#db2b39",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: "#db2b39", 
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#db2b39",
        tabBarInactiveTintColor: "#fdf0d5",
        tabBarStyle: { backgroundColor: "#1e6ba5", height: 70, },
        tabBarLabelStyle: {
          fontSize: 12,
          color: "#fdf0d5"
        },
        headerStyle: { backgroundColor: "#1e6ba5" },
        headerTintColor: "#fdf0d5",
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
          headerShown: false,
          title: "Alertar",
          tabBarActiveTintColor: "black",
          tabBarIcon: () => (
            <FontAwesome name="warning" size={26} color="#fdf0d5" />
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
            <FontAwesome name="user" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
