import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';

// 1. Definição da interface (tipos) das propriedades (props)
interface InfoCardProps {
  title: string;
  // ReactNode permite passar qualquer coisa (Text, View, outros componentes) como children
  children: ReactNode; 
}

// 2. Criação do componente com tipagem
const InfoCard: React.FC<InfoCardProps> = ({ title, children }) => {
  return (
    <View className="mt-8 bg-white rounded-3xl p-6 w-full shadow-lg">
      <Text className="text-base font-bold text-[#1e6ba5] mb-3">{title}</Text>
      {/* Aqui são renderizados os elementos que você passa para o componente */}
      {children}
    </View>
  );
};

export default InfoCard;