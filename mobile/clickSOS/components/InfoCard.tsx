// src/components/InfoCard.tsx
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface InfoCardProps {
  title: string;
  iconName?: string; 
  iconColor?: string; 
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, iconName, iconColor = '#1e6ba5', children }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow mb-4 w-full">
      <View className="flex-row items-center mb-3">
        {iconName && (
          <FontAwesome name={iconName} size={20} color={iconColor} className="mr-2" />
        )}
        <Text className="text-lg font-bold text-gray-800 ml-2">{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default InfoCard;