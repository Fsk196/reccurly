import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link
        className="bg-primary text-white p-2 rounded-md mt-4"
        href="/sign-in"
      >
        Sign In
      </Link>
    </View>
  );
};

export default SignUp;
