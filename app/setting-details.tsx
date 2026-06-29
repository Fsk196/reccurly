import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSSafeAreaView);

const SettingDetails = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>SettingDetails</Text>
    </SafeAreaView>
  );
};

export default SettingDetails;
