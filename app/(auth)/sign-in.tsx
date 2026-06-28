import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link
        className="bg-primary text-white p-2 rounded-md mt-4"
        href="/sign-up"
      >
        Sign Up
      </Link>
    </View>
  );
};

export default SignIn;
