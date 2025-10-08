import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// define o tipo Contato simples para o alerta
interface Contato {
    email: string;
}

// definição da interface Alerta
interface Alerta {
    id: number;
    latitude: number;
    longitude: number;
    dataHora?: string;
    criadoEm: string; // Campo necessário para a exibição (data/hora de criação)
    contatos: Contato[]; // Lista de contatos que receberam o alerta
}

interface AlertsCardProps {
    alertas: Alerta[];
    loading: boolean;
    pagina: number;
    totalPaginas: number;
    fetchAlertas: (paginaAtual: number) => Promise<void>;
}

const AlertsCard: React.FC<AlertsCardProps> = ({
    alertas,
    loading,
    pagina,
    totalPaginas,
    fetchAlertas
}) => {
    
    // função para carregar a próxima página
    const loadMore = () => {
        // verifica se não está carregando e se há mais páginas disponíveis
        if (!loading && pagina < totalPaginas - 1) {
            fetchAlertas(pagina + 1);
        }
    };

    // formata a lista de emails
    const formatContatos = (contatos: Contato[]) => {
        return contatos.map(c => c.email).join(", ");
    };

    return (
        <View className="bg-white p-4 rounded-xl shadow mb-3">
            
            {/* Título com Ícone */}
            <View className="flex-row items-center mb-4">
                <FontAwesome 
                    name="bell" 
                    size={20} 
                    color="#db2b39" 
                />
                <Text className="text-xl font-bold text-[#db2b39] ml-2">Histórico de Alertas</Text>
            </View>

            {/* estado de Carregamento Inicial */}
            {loading && alertas.length === 0 ? (
                <View className="my-4">
                    <ActivityIndicator size="large" color="#1e6ba5" />
                </View>
            ) : alertas.length === 0 ? (
                <Text>Nenhum alerta encontrado.</Text>
            ) : (
                <>
                    {/* Lista de Alertas */}
                    {alertas.map((item, index) => (
                        <View 
                            key={item.id ? String(item.id) : `alert-${index}`}
                            className="flex-col p-2 bg-gray-100 rounded mb-2 border-l-4 border-red"
                        >
                            <Text className="font-bold">Data/Hora: {item.criadoEm}h</Text>
                            <Text className="text-sm text-gray-600">
                                Enviado para:{" "}
                                {formatContatos(item.contatos)}
                            </Text>
                        </View>
                    ))}

                    {/* Botão Carregar Mais / Indicador de Carregamento */}
                    
                    {loading && (
                        <View className="my-4">
                            <ActivityIndicator size="small" color="#1e6ba5" />
                        </View>
                    )}

                    {/* Botão Carregar Mais (se não estiver carregando e houver mais páginas) */}
                    {pagina < totalPaginas - 1 && !loading && (
                        <TouchableOpacity 
                            className="mt-4 bg-[#1e6ba5] p-2 rounded" 
                            onPress={loadMore}
                        >
                            <Text className="text-white text-center font-semibold">
                                Carregar Mais Alertas
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Fim da Lista */}
                    {pagina >= totalPaginas - 1 && alertas.length > 0 && !loading && (
                        <Text className="text-center text-gray-500 mt-4">Fim da lista.</Text>
                    )}
                </>
            )}
        </View>
    );
};

export default AlertsCard;