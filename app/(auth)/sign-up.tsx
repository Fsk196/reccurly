import React from "react";
import { Pressable, Text, View } from "react-native";
import { type Href, Link, useRouter } from "expo-router";
import { useAuth, useSignUp } from "@clerk/expo";
import { clsx } from "clsx";
import AuthLayout from "@/components/AuthLayout";
import AuthField from "@/components/AuthField";
import {
  getAuthErrorMessage,
  validateCode,
  validateEmail,
  validatePassword,
  VERIFICATION_CODE_LENGTH,
} from "@/libs/auth";

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const [emailError, setEmailError] = React.useState<string>();
  const [passwordError, setPasswordError] = React.useState<string>();
  const [codeError, setCodeError] = React.useState<string>();
  const [formError, setFormError] = React.useState<string>();

  const isSubmitting = fetchStatus === "fetching";

  const goHome = React.useCallback(() => {
    signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        // A pending session task (e.g. choosing an org) must finish first.
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as Href);
      },
    });
  }, [router, signUp]);

  const handleSubmit = async () => {
    const nextEmailError = validateEmail(emailAddress);
    const nextPasswordError = validatePassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(undefined);
    if (nextEmailError || nextPasswordError) return;

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFormError(getAuthErrorMessage(error));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    const nextCodeError = validateCode(code);
    setCodeError(nextCodeError);
    setFormError(undefined);
    if (nextCodeError) return;

    const { error } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (error) {
      setFormError(
        getAuthErrorMessage(error, "That code didn't match. Try again."),
      );
      return;
    }

    if (signUp.status === "complete") {
      goHome();
    } else {
      setFormError("We couldn't verify your account. Please try again.");
    }
  };

  const handleResend = async () => {
    setCode("");
    setCodeError(undefined);
    setFormError(undefined);
    await signUp.verifications.sendEmailCode();
  };

  // The layout guard redirects, but guard the render too to avoid a flash.
  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (isVerifying) {
    return (
      <AuthLayout
        title="Verify your email"
        subtitle={`Enter the ${VERIFICATION_CODE_LENGTH}-digit code we sent to ${emailAddress.trim()}.`}
      >
        <View className="auth-card">
          <View className="auth-form">
            <AuthField
              label="Verification code"
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={VERIFICATION_CODE_LENGTH}
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
              returnKeyType="done"
              onSubmitEditing={handleVerify}
              error={codeError ?? errors?.fields?.code?.message}
            />

            {formError ? <Text className="auth-error">{formError}</Text> : null}

            <Pressable
              className={clsx(
                "auth-button",
                isSubmitting && "auth-button-disabled",
              )}
              onPress={handleVerify}
              disabled={isSubmitting}
            >
              <Text className="auth-button-text">
                {isSubmitting ? "Verifying…" : "Verify email"}
              </Text>
            </Pressable>

            <Pressable
              className="auth-secondary-button"
              onPress={handleResend}
              disabled={isSubmitting}
            >
              <Text className="auth-secondary-button-text">Resend code</Text>
            </Pressable>
          </View>
        </View>
      </AuthLayout>
    );
  }

  const canSubmit = Boolean(emailAddress && password) && !isSubmitting;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Track every renewal in one place and never get surprised by a charge again."
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">Already have an account?</Text>
          <Link href="/sign-in" replace>
            <Text className="auth-link">Sign in</Text>
          </Link>
        </View>
      }
    >
      <View className="auth-card">
        <View className="auth-form">
          <AuthField
            label="Email"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="next"
            error={emailError ?? errors?.fields?.emailAddress?.message}
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            error={passwordError ?? errors?.fields?.password?.message}
          />

          {formError ? <Text className="auth-error">{formError}</Text> : null}

          <Pressable
            className={clsx(
              "auth-button",
              !canSubmit && "auth-button-disabled",
            )}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text className="auth-button-text">
              {isSubmitting ? "Creating account…" : "Create account"}
            </Text>
          </Pressable>

          <Text className="auth-helper">
            By continuing you agree to keep your subscriptions organized.
          </Text>
        </View>

        {/* Invisible bot-protection challenge required to complete sign-up. */}
        <View nativeID="clerk-captcha" />
      </View>
    </AuthLayout>
  );
}
