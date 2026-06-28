import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSSafeAreaView);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>

      <Link
        className="bg-primary text-white p-2 rounded-md mt-4"
        href="/sign-in"
      >
        Sign In
      </Link>

      <Link
        className="bg-primary text-white p-2 rounded-md mt-4"
        href="/sign-up"
      >
        Sign Up
      </Link>

      <Link
        className="bg-primary text-white p-2 rounded-md mt-4"
        href="/subscriptions/spotify"
      >
        Spotify
      </Link>

      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude-max" },
        }}
        className="bg-primary text-white p-2 rounded-md mt-4"
      >
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
