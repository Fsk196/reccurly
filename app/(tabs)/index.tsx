import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
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
    </View>
  );
}
