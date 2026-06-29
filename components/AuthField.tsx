import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { clsx } from "clsx";
import { colors } from "@/constants/theme";

interface AuthFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

/**
 * Labeled text input that matches the app's auth design tokens and surfaces
 * inline validation/server errors with an accented border.
 */
const AuthField = ({ label, error, ...inputProps }: AuthFieldProps) => {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        className={clsx("auth-input", error && "auth-input-error")}
        placeholderTextColor={colors.mutedForeground}
        {...inputProps}
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
};

export default AuthField;
