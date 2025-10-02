import { useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [contato, setContato] = useState({ nome: "", email: "", telefone: "" });

    const handleCadastro = async () => {
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        const body = {
            nome,
            dataNascimento,
            email,
            senha,
            confirmarSenha,
            contatos: [contato] // apenas 1 contato
        };

        try {
            const response = await fetch("http://192.168.108.218:8080/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!response.ok) {
                const data = await response.json(); // lê o JSON do backend
                if (data.erros) {
                    const mensagens = Object.entries(data.erros)
                        .map(([campo, msg]) => `${campo}: ${msg}`)
                        .join("\n");
                    Alert.alert("Erro no cadastro", mensagens);
                } else if (data.mensagem) {
                    // se o backend retornou { "mensagem": "..." }
                    Alert.alert("Erro", data.mensagem);
                } else {
                    Alert.alert("Erro", "Erro desconhecido"); // fallback
                }
                return;
            }

            Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
            router.replace("/login");
        } catch (error) {
            console.log(error);
            Alert.alert("Erro", `Não foi possível conectar ao backend. ${error}`);
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 p-6">
            <View className="bg-white p-6 rounded-2xl shadow-lg">
                <Text className="text-2xl font-bold text-center mb-6 text-blue-600">
                    Cadastro ClickSOS
                </Text>

                <TextInput
                    placeholder="Nome completo"
                    value={nome}
                    onChangeText={setNome}
                    className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
                />

                <TextInput
                    placeholder="Data de nascimento (dd/MM/yyyy)"
                    value={dataNascimento}
                    onChangeText={setDataNascimento}
                    className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
                />

                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
                />

                <TextInput
                    placeholder="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry
                    className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
                />

                <TextInput
                    placeholder="Confirmar senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    secureTextEntry
                    className="border border-gray-300 rounded-xl p-3 mb-4 w-full"
                />

                <Text className="text-lg font-semibold mb-2">Contato principal</Text>

                <TextInput
                    placeholder="Nome do contato"
                    value={contato.nome}
                    onChangeText={(text) => setContato({ ...contato, nome: text })}
                    className="border border-gray-300 rounded-xl p-2 mb-2 w-full"
                />
                <TextInput
                    placeholder="Email do contato"
                    value={contato.email}
                    onChangeText={(text) => setContato({ ...contato, email: text })}
                    className="border border-gray-300 rounded-xl p-2 mb-2 w-full"
                />
                <TextInput
                    placeholder="Telefone do contato"
                    value={contato.telefone}
                    onChangeText={(text) => setContato({ ...contato, telefone: text })}
                    keyboardType="phone-pad"
                    className="border border-gray-300 rounded-xl p-2 mb-2 w-full"
                />

                <Text className="text-sm text-gray-500 mb-4">
                    Você poderá adicionar mais contatos depois, na tela Meu Perfil.
                </Text>

                <TouchableOpacity
                    onPress={handleCadastro}
                    className="bg-blue-600 py-3 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Cadastrar
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
