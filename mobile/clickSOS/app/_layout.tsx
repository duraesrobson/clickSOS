import { Stack } from "expo-router";
import "./styles/global.css";
import { AuthProvider } from "./utils/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        {/* ROTAS CORRETAS: Apenas as rotas que estão na pasta raiz 'app/' */}
        
        {/* As rotas 'index', 'alertar' e 'perfil' foram removidas.
            Elas são gerenciadas pelo grupo (protected)/(tabs) e não devem ser listadas aqui. */}
        
        {/* Rotas de autenticação */}
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ headerShown: false }} />
        
        {/* Grupo de rotas protegidas (gerenciado por app/(protected)/_layout.tsx) */}
        <Stack.Screen name="(protected)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}