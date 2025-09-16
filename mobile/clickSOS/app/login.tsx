import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from './utils/authContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.99.218:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const msg = await response.text();
        Alert.alert('Erro', msg);
        return;
      }

      const data = await response.json();
      await login(data.token); // Atualiza o contexto
      router.replace('/(protected)'); // Redireciona
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao backend.');
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border w-full p-2 mb-4"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        className="border w-full p-2 mb-4"
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
