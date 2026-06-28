import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSSafeAreaView);

const Subscriptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Subscriptions</Text>
    </SafeAreaView>
  );
};

export default Subscriptions;
