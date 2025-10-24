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
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

const apiURL = Constants.expoConfig?.extra?.API_URL;

// funcao para adicionar 0 em partes da data se forem digitadas com apenas um digito
const padDateString = (dateString: string) => {
    const parts = dateString.split('/');

    if (parts.length === 3) {
        let [day, month, year] = parts;

        day = day.padStart(2, '0');
        month = month.padStart(2, '0');

        return `${day}/${month}/${year}`;
    }

    return dateString;
}

export default function Cadastro() {
    const router = useRouter();

    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [contato, setContato] = useState({ nome: "", anoNascimento: "", email: "", telefone: "" });

    const handleCadastro = async () => {
        if (senha !== confirmarSenha) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        const dataNascimentoFormatada = padDateString(dataNascimento);

        const body = {
            nome,
            dataNascimento: dataNascimentoFormatada,
            telefone,
            email,
            senha,
            confirmarSenha,
            contatos: [contato] // apenas 1 contato
        };

        try {
            const response = await fetch("http://150.230.64.80:8080/usuarios", {
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
        <LinearGradient
            colors={["#e8f2f8", "#fdf0d5"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="flex-1 p-6"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 50, paddingTop: 50 }}
                showsVerticalScrollIndicator={false}
            >

                <View className="bg-white justify-center  p-6 rounded-2xl shadow-lg">
                    <Text className="text-blue text-2xl font-bold text-center mb-6 text-blue-600">
                        Cadastre-se
                    </Text>

                    <Text className="text-lg text-blue font-semibold mb-2">Usuário</Text>

                    <TextInput
                        placeholder="Nome Completo"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                        placeholderTextColor="#6b7280"
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <TextInput
                        placeholder="Data de Nascimento (dd/MM/yyyy)"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        placeholderTextColor="#6b7280"
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <TextInput
                        placeholder="Telefone (Ex.: 21912345678)"
                        value={telefone}
                        placeholderTextColor="#6b7280"
                        keyboardType="phone-pad"
                        onChangeText={setTelefone}
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <TextInput
                        placeholder="Email"
                        value={email}
                        placeholderTextColor="#6b7280"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <TextInput
                        placeholder="Senha"
                        placeholderTextColor="#6b7280"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <TextInput
                        placeholder="Confirmar Senha"
                        placeholderTextColor="#6b7280"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <Text className="text-lg text-blue font-semibold mb-2 mt-2">Contato Principal</Text>

                    <TextInput
                        placeholder="Nome do Contato"
                        placeholderTextColor="#6b7280"
                        value={contato.nome}
                        onChangeText={(text) => setContato({ ...contato, nome: text })}
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />
                    <TextInput
                        placeholder="Ano de Nasc. do Contato (Ex.: 1990)"
                        placeholderTextColor="#6b7280"
                        value={contato.anoNascimento}
                        onChangeText={(text) => setContato({ ...contato, anoNascimento: text })}
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />
                    <TextInput
                        placeholder="Email do Contato"
                        placeholderTextColor="#6b7280"
                        value={contato.email}
                        onChangeText={(text) => setContato({ ...contato, email: text })}
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />
                    <TextInput
                        placeholder="Telefone do Contato"
                        placeholderTextColor="#6b7280"
                        value={contato.telefone}
                        onChangeText={(text) => setContato({ ...contato, telefone: text })}
                        keyboardType="phone-pad"
                        className="border text-gray-500 border-gray-300 rounded-xl p-3 mb-4 w-full"
                    />

                    <Text className="text-sm text-center text-gray-500 mb-4">
                        Você poderá adicionar mais contatos depois, na tela "Perfil".
                    </Text>

                    <TouchableOpacity
                        onPress={handleCadastro}
                        className="bg-blue py-3 rounded-xl">
                        <Text className="text-white text-center font-semibold text-lg">
                            Cadastrar
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>

        </LinearGradient>
    );
}
