import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { useAuth } from "../../utils/authContext";
import { API_URL } from "@env";

export default function Perfil() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [contatos, setContatos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoContato, setNovoContato] = useState({ nome: "", email: "", telefone: "" });
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);

  // função para buscar alertas paginados
  const fetchAlertas = async (paginaAtual = 0) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/alertas/meus-alertas?page=${paginaAtual}&size=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (paginaAtual === 0) {
        setAlertas(data.content);
      } else {
        setAlertas(prev => [...prev, ...data.content]);
      }

      setPagina(data.number);
      setTotalPaginas(data.totalPages);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível carregar os alertas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // get dados do usuario pela api
        const userRes = await fetch(`${API_URL}/usuarios/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUsuario(userData);
        setContatos(userData.contatos || []);

        // get alertas do usuario pela api (primeira página)
        await fetchAlertas(0);
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
        `${API_URL}/usuarios/me/contatos/${id}`, {
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

  //funcao para adicionar contato
  const salvarContato = async () => {
    const { nome, email, telefone } = novoContato;
    if (!nome || !email || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/me/contatos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(novoContato),
      });

      if (response.ok) {
        const contatoCriado = await response.json();
        setContatos([...contatos, contatoCriado]);
        setModalVisible(false);
        setNovoContato({ nome: "", email: "", telefone: "" });
      } else {
        let errorMsg = "Não foi possível adicionar o contato.";
        try {
          //pega o erro mostrado pelo backend
          const errorData = await response.json();
          errorMsg = errorData.mensagem || errorMsg;
        } catch {
          try {
            errorMsg = await response.text();
          } catch { }
        }
        Alert.alert("Erro", errorMsg);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao adicionar contato.");
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
              key={item.id ? String(item.id) : `temp-${index}`} // garante sempre único              
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
        <TouchableOpacity className="mt-2 bg-green-600 p-2 rounded" onPress={() => setModalVisible(true)}>
          <Text className="text-white text-center font-semibold">
            Adicionar Contato
          </Text>
        </TouchableOpacity>
      </View>

      {/* modal para adicionar contato */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white w-full p-4 rounded-xl">
            <Text className="text-xl font-bold mb-2">Novo Contato</Text>
            <TextInput
              placeholder="Nome"
              className="border border-gray-300 rounded p-2 mb-2"
              value={novoContato.nome}
              onChangeText={(text) => setNovoContato({ ...novoContato, nome: text })}
            />
            <TextInput
              placeholder="Email"
              className="border border-gray-300 rounded p-2 mb-2"
              keyboardType="email-address"
              value={novoContato.email}
              onChangeText={(text) => setNovoContato({ ...novoContato, email: text })}
            />
            <TextInput
              placeholder="Telefone"
              className="border border-gray-300 rounded p-2 mb-4"
              keyboardType="phone-pad"
              value={novoContato.telefone}
              onChangeText={(text) => setNovoContato({ ...novoContato, telefone: text })}
            />
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-gray-600 font-semibold">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarContato}>
                <Text className="text-green-600 font-semibold">Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ALERTAS */}
      <View className="bg-white p-4 rounded-xl shadow mb-4">
        <Text className="text-xl font-bold text-blue-600 mb-2">Meus Alertas</Text>
        {alertas.length === 0 ? (
          <Text>Nenhum alerta gerado.</Text>
        ) : (
          <>
            {alertas.map((item, index) => (
              <View key={item.id ? String(item.id) : `alert-${index}`} className="flex-col p-2 bg-gray-100 rounded mb-2">
                <Text className="font-bold">Enviado em: {item.criadoEm}h</Text>
                <Text className="text-sm text-gray-600">
                  Enviado para:{""}
                  {item.contatos.map((c: { email: string }) => c.email).join(", ")}
                </Text>
              </View>
            ))}

            <View className="flex-row justify-between mt-2">
              {pagina > 0 && (
                <TouchableOpacity
                  className="bg-gray-400 p-2 rounded"
                  onPress={() => fetchAlertas(pagina - 1)}
                >
                  <Text className="text-white font-semibold text-center">{"<"}</Text>
                </TouchableOpacity>
              )}
              {pagina + 1 < totalPaginas && (
                <TouchableOpacity
                  className="bg-blue-600 p-2 rounded"
                  onPress={() => fetchAlertas(pagina + 1)}
                >
                  <Text className="text-white font-semibold text-center">{">"}</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>


      {/* BOTÃO SAIR */}
      <TouchableOpacity
        onPress={logout}
        className="bg-red-600 px-6 py-3 rounded-xl mb-6"
      >
        <Text className="text-white font-semibold text-center">Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
