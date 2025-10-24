import { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Text } from "react-native";
import { useAuth } from "../../../utils/authContext";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import PerfilCard from "../../../components/PerfilCard";
import ContatosCard from "../../../components/ContatosCard";
import AlertsCard from "../../../components/AlertsCard";
import Constants from "expo-constants";

const apiURL = Constants.expoConfig?.extra?.API_URL;

export default function Perfil() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);
  const [contatos, setContatos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [novoContato, setNovoContato] = useState<any>({ nome: "", email: "", telefone: "", anoNascimento: null });
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);


  const fetchAlertas = async (paginaAtual = 0) => {
    try {
      setLoading(true);
      const res = await fetch(`http://150.230.64.80:8080/alertas/meus-alertas?page=${paginaAtual}&size=10`, {
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
        const userRes = await fetch("http://150.230.64.80:8080/usuarios/me", {
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

  // funcao para apagar contato pelo id (MANTIDA NO COMPONENTE PAI)
  const deletarContato = async (id: number) => {
    try {
      const response = await fetch(
        `http://150.230.64.80:8080/usuarios/me/contatos/${id}`, {
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

  //funcao para adicionar contato (MANTIDA NO COMPONENTE PAI)
  const salvarContato = async () => {
    const { nome, email, telefone, anoNascimento } = novoContato;
    if (!nome || !email || !telefone || !anoNascimento) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("http://150.230.64.80:8080/usuarios/me/contatos", {
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
        setNovoContato({ nome: "", email: "", telefone: "", anoNascimento: null });
      } else {
        let errorMsg = "Não foi possível adicionar o contato.";
        try {
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

  if (loading && !usuario) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#1e6ba5" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#e8f2f8", "#fdf0d5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      className="flex-1"
    >
      <ScrollView className="flex-1 p-4 mt-11">
        <StatusBar style="dark" />

        {/* PERFIL (Usando PerfilCard) */}
        {usuario ? (
          <PerfilCard
            nome={usuario.nome}
            email={usuario.email}
            telefone={usuario.telefone}
            dataNascimento={usuario.dataNascimento}
          />
        ) : (
          <ActivityIndicator size="small" color="#1e6ba5" />
        )}

        {/* CONTATOS (Usando ContatosCard) */}
        <ContatosCard
          contatos={contatos}
          deletarContato={deletarContato}
          salvarContato={salvarContato}
          novoContato={novoContato}
          setNovoContato={setNovoContato}
        />

        {/* ALERTAS (Usando AlertsCard) */}
        <AlertsCard
          alertas={alertas}
          loading={loading}
          pagina={pagina}
          totalPaginas={totalPaginas}
          fetchAlertas={fetchAlertas}
        />


        {/* Botão Sair */}
        <View className="items-center pb-12 ">
          <TouchableOpacity
            onPress={logout}
            className="mt-4 mb-8 bg-red px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Sair da Conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </LinearGradient>
  );
}