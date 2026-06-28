import { View, Text } from "react-native";
import React from "react";
import { Link, useLocalSearchParams } from "expo-router";

const SubscriptionDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        SubscriptionDetails: {id}
      </Text>
      <Link href="/" className="bg-primary text-white p-2 rounded-md mt-4">
        Go Back
      </Link>
    </View>
  );
};

export default SubscriptionDetails;
