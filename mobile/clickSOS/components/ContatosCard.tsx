import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';

interface Contato {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    anoNascimento: number;
}

const anoAtual = 2025;
const calcularIdadeContato = (anoNascimento: number) => {
    return anoAtual - anoNascimento
};

interface ContactsCardProps {
    contatos: Contato[];
    deletarContato: (id: number) => Promise<void>;
    salvarContato: (contato: { nome: string; email: string; telefone: string; anoNascimento: number }) => Promise<void>;
    novoContato: { nome: string; email: string; telefone: string; anoNascimento: number | null };
    setNovoContato: React.Dispatch<React.SetStateAction<any>>;
}

const ContactsCard: React.FC<ContactsCardProps> = ({
    contatos,
    deletarContato,
    salvarContato,
    novoContato,
    setNovoContato,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Lógica da Modal (transferida do componente pai)
    const handleDeletar = (item: Contato) => {
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
        );
    };

    const handleSalvar = async () => {
        const { nome, email, telefone, anoNascimento } = novoContato;

        if (!nome || !email || !telefone || !anoNascimento) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios")
            return;
        }

        if (telefone.length !== 11) {
            Alert.alert("Erro", "O telefone deve conter exatamente 11 dígitos (incluindo DDD e 9).")
        }

        if (Number(anoNascimento) < 1920 || Number(anoNascimento) > anoAtual) {
            Alert.alert("Erro", "O Ano de Nascimento deve ser entre 1920 e o ano atual (ex: 1985).");
            return;
        }

        setIsLoading(true);

        try {
            await salvarContato({
                nome,
                email,
                telefone,
                anoNascimento: anoNascimento as number,
            });
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o contato. Tente novamente.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow mb-4">
            <View className="flex-row items-center mb-4">
                <FontAwesome
                    name="address-book"
                    size={20}
                    color="#1e6ba5"
                />
                <Text className="text-xl font-bold text-blue ml-2">Contatos de Emergência</Text>
            </View>

            {contatos.length === 0 ? (
                <Text>Nenhum contato cadastrado.</Text>
            ) : (
                contatos.map((item, index) => (
                    <View
                        key={item.id ? String(item.id) : `temp-${index}`}
                        className="flex-row justify-between items-center p-2 bg-gray-100 rounded mb-2 border-l-4 border-blue"
                    >
                        <Text>
                            <Text className="font-bold text-blue">{item.nome}</Text> {"\n"}
                            Email: <Text className='font-medium text-blue'>{item.email}</Text> {"\n"}
                            Telefone: <Text className='font-medium text-blue'>{item.telefone}</Text> {"\n"}
                            Idade: <Text className='font-medium text-blue'>{calcularIdadeContato(item.anoNascimento)} anos</Text>
                        </Text>
                        <TouchableOpacity onPress={() => handleDeletar(item)}>
                            <FontAwesome
                                name="trash"
                                size={20}
                                color="#db2b39"
                            />
                        </TouchableOpacity>
                    </View>
                ))
            )}

            <TouchableOpacity className="mt-2 bg-blue p-2 rounded-xl" onPress={() => setModalVisible(true)}>
                <Text className="text-light text-center font-semibold">
                    Adicionar Contato
                </Text>
            </TouchableOpacity>

            {/* MODAL PARA ADICIONAR CONTATO */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View className="flex-1 justify-center items-center bg-black/50 p-6">
                    <View className="bg-white w-full p-4 rounded-xl">
                        <Text className="text-blue text-xl font-bold mb-2">Novo Contato</Text>
                        <TextInput
                            placeholder="Nome e Sobrenome"
                            placeholderTextColor="#6b7280"
                            className="border border-gray-300 rounded p-2 mb-2"
                            value={novoContato.nome}
                            onChangeText={(text) => setNovoContato({ ...novoContato, nome: text })}
                            editable={!isLoading}
                        />
                        <TextInput
                            placeholder="Email (teste@email.com)"
                            placeholderTextColor="#6b7280"
                            className="border border-gray-300 rounded p-2 mb-2"
                            keyboardType="email-address"
                            value={novoContato.email}
                            onChangeText={(text) => setNovoContato({ ...novoContato, email: text })}
                            editable={!isLoading}
                        />
                        <TextInput
                            placeholder="Telefone (21912345678)"
                            placeholderTextColor="#6b7280"
                            className="border border-gray-300 rounded p-2 mb-4"
                            maxLength={11}
                            keyboardType="phone-pad"
                            value={novoContato.telefone}
                            onChangeText={(text) => setNovoContato({ ...novoContato, telefone: text })}
                            editable={!isLoading}
                        />
                        <TextInput
                            placeholder="Ano de Nascimento (Ex.: 1995)"
                            placeholderTextColor="#6b7280"
                            className="border border-gray-300 rounded p-2 mb-4"
                            keyboardType="phone-pad"
                            value={novoContato.anoNascimento === null ? '' : String(novoContato.anoNascimento)}
                            onChangeText={(text) => {
                                const textoLimpo = text.replace(/[^0-9]/g, '');
                                const num = parseInt(textoLimpo, 10);
                                setNovoContato({
                                    ...novoContato,
                                    anoNascimento: textoLimpo === '' ? null : num
                                });
                            }}
                            maxLength={4}
                            editable={!isLoading}
                        />
                        <View className="flex-row justify-between ">
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text className="text-gray-500 font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSalvar} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="1e6ba5" />
                                ) : (
                                    <Text className="text-blue font-semibold">Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ContactsCard;