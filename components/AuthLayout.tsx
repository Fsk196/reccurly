import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";

const SafeAreaView = styled(RNSSafeAreaView);

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Branded shell shared by every auth screen: cream backdrop, Recurrly mark,
 * a centered headline, and a keyboard-aware scroll area for the form.
 */
const AuthLayout = ({ title, subtitle, children, footer }: AuthLayoutProps) => {
  return (
    <SafeAreaView className="auth-safe-area" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        className="auth-screen"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View className="gap-3">
                <Text className="auth-wordmark">Recurrly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>

            <Text className="auth-title">{title}</Text>
            {subtitle ? (
              <Text className="auth-subtitle">{subtitle}</Text>
            ) : null}
          </View>

          {children}
          {footer}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
