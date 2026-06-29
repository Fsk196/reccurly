import { Image, Pressable, Text, View } from "react-native";
import React from "react";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import images from "@/constants/images";
import { HOME_USER } from "@/constants/data";

const SafeAreaView = styled(RNSSafeAreaView);

const Settings = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <View className="flex-1 gap-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-sans-bold text-primary">Settings</Text>

          <Pressable
            onPress={() => router.push("/setting-details")}
            className="flex-row items-center gap-2 border border-foreground/20 rounded-full p-2"
          >
            <Ionicons name="settings-outline" size={24} color="black" />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push("/setting-details")}
          className="bg-[#F6ECC9] rounded-3xl p-4 w-full h-24 justify-between flex-row items-center"
        >
          <View className="home-user">
            <Image source={images.avatar} className="size-14 rounded-full" />
            <View>
              <Text className="ml-4 text-2xl font-sans-bold text-primary">
                {HOME_USER.name}
              </Text>
              <Text className="ml-4 text-base font-sans-medium text-primary/80">
                {HOME_USER.email}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <Ionicons name="chevron-forward-outline" size={24} color="black" />
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
