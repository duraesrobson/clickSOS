import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { useAuth } from "../../utils/authContext";

export default function Perfil() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [contatos, setContatos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // get dados do usuario pela api
        const userRes = await fetch("http://192.168.126.218:8080/usuarios/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUsuario(userData);
        setContatos(userData.contatos || []);

        // get alertas do usuario pela api
        const alertRes = await fetch(
          "http://192.168.126.218:8080/alertas/meus-alertas",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const alertData = await alertRes.json();
        setAlertas(alertData.content || []);
      } catch (error) {
        console.log(error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // funcao para apagar contato pelo id
  const deletarContato = async (id: number) => {
    try {
      const response = await fetch(
        `http://192.168.126.218:8080/usuarios/me/contatos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
      );

      if (response.ok) {
        setContatos(contatos.filter((c) => c.id !== id));
      } else {
        Alert.alert("Erro", "Não foi possível excluir o contato.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro na exclusão.")
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* PERFIL */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-xl font-bold text-blue-600 mb-2">Perfil</Text>
        {usuario ? (
          <>
            <Text>Nome: {usuario.nome}</Text>
            <Text>Email: {usuario.email}</Text>
            <Text>Data de Nascimento: {usuario.dataNascimento}</Text>
          </>
        ) : (
          <Text>Carregando perfil...</Text>
        )}
      </View>

      {/* CONTATOS */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-xl font-bold text-blue-600 mb-2">Contatos</Text>
        {contatos.length === 0 ? (
          <Text>Nenhum contato cadastrado.</Text>
        ) : (
          contatos.map((item, index) => (
            <View
              key={item.id ?? index} // garante id único
              className="flex-row justify-between p-2 bg-gray-100 rounded mb-2"
            >
              <Text>
                <Text className="font-bold">{item.nome}</Text> {"\n"}
                Email: {item.email} {"\n"}
                Telefone: {item.telefone}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Confirmar Exclusão",
                    `Deseja realmente excluir o contato "${item.nome}"?`,
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Excluir",
                        style: "destructive",
                        onPress: () => deletarContato(item.id),
                      },
                    ]
                  )
                }
              >
                <Text className="text-red-600">Excluir</Text>
              </TouchableOpacity>

            </View>
          ))
        )}
        <TouchableOpacity className="mt-2 bg-green-600 p-2 rounded">
          <Text className="text-white text-center font-semibold">
            Adicionar Contato
          </Text>
        </TouchableOpacity>
      </View>

      {/* ALERTAS */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-xl font-bold text-blue-600 mb-2">Meus Alertas</Text>
        {alertas.length === 0 ? (
          <Text>Nenhum alerta gerado.</Text>
        ) : (
          alertas.map((item, index) => (
            <View
              key={item.id ?? index} // <- garante key única
              className="flex-col p-2 bg-gray-100 rounded mb-2"
            >
              <Text className="font-bold">{item.criadoEm}</Text>
              <Text className="text-sm text-gray-600">Enviado para: {item.usuario.email}</Text>
            </View>
          ))
        )}
      </View>

      {/* BOTÃO SAIR */}
      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 px-6 py-3 rounded-xl mb-6"
      >
        <Text className="text-white font-semibold text-center">Sair</Text>
      </TouchableOpacity>
    </ScrollView >
  );
}
