// src/components/ProfileCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // ⬅️ Novo Importe

interface ProfileCardProps {
  nome: string;
  email: string;
  dataNascimento: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ nome, email, dataNascimento }) => {
  return (
    <View className="mt-10 bg-white p-4 rounded-xl shadow mb-4">
      
      {/* 🟢 Bloco do Título com Ícone */}
      <View className="flex-row items-center mb-3">
        <FontAwesome 
          name="user-circle" // ⬅️ Ícone de usuário (círculo)
          size={24} 
          color="#1e6ba5" // Cor do título
        />
        <Text className="text-xl font-bold text-[#1e6ba5] ml-2">Perfil</Text>
      </View>
      
      {/* Conteúdo do Perfil */}
      <Text>Nome: <Text className='font-bold text-blue'>{nome}</Text></Text>
      <Text>Email: <Text className='font-bold text-blue'>{email}</Text></Text>
      <Text>Data de Nascimento: <Text className='font-bold text-blue'>{dataNascimento}</Text></Text>
    </View>
  );
};

export default ProfileCard;