// src/components/ContactsCard.tsx
import { FontAwesome } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';

// Definindo o tipo Contato
interface Contato {
    id: number;
    nome: string;
    email: string;
    telefone: string;
}

interface ContactsCardProps {
    contatos: Contato[];
    deletarContato: (id: number) => Promise<void>;
    salvarContato: () => Promise<void>;
    novoContato: { nome: string; email: string; telefone: string };
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
        await salvarContato();
        // Se o contato for salvo com sucesso (lógica no componente pai), a modal fechará lá
        if (contatos.length + 1 > contatos.length) { // Checagem simples para tentar fechar
            setModalVisible(false);
        }
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow mb-4">
            {/* Título com Ícone */}
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
                            <Text className="font-bold">{item.nome}</Text> {"\n"}
                            Email: {item.email} {"\n"}
                            Telefone: {item.telefone}
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
                        <View className="flex-row justify-between ">
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text className="text-gray-500 font-semibold">Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSalvar}>
                                <Text className="text-blue font-semibold">Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ContactsCard;