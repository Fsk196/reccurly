import React from "react";
import { Pressable, Text, View } from "react-native";
import { type Href, Link, useRouter } from "expo-router";
import { useSignIn } from "@clerk/expo";
import { clsx } from "clsx";
import AuthLayout from "@/components/AuthLayout";
import AuthField from "@/components/AuthField";
import {
  getAuthErrorMessage,
  validateCode,
  validateEmail,
  validateSignInPassword,
  VERIFICATION_CODE_LENGTH,
} from "@/libs/auth";

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const [emailError, setEmailError] = React.useState<string>();
  const [passwordError, setPasswordError] = React.useState<string>();
  const [codeError, setCodeError] = React.useState<string>();
  const [formError, setFormError] = React.useState<string>();

  const isSubmitting = fetchStatus === "fetching";
  const emailCodeFactor = signIn.supportedSecondFactors?.find(
    (factor) => factor.strategy === "email_code",
  );
  const needsCode =
    Boolean(emailCodeFactor) &&
    (signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor");

  const goHome = React.useCallback(() => {
    signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        // A pending session task (e.g. choosing an org) must finish first.
        if (session?.currentTask) return;
        router.replace(decorateUrl("/") as Href);
      },
    });
  }, [router, signIn]);

  const sendEmailCode = async () => {
    const emailCodeFactor = signIn.supportedSecondFactors?.find(
      (factor) => factor.strategy === "email_code",
    );
    if (emailCodeFactor) {
      await signIn.mfa.sendEmailCode();
    }
  };

  const handleSubmit = async () => {
    const nextEmailError = validateEmail(emailAddress);
    const nextPasswordError = validateSignInPassword(password);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setFormError(undefined);
    if (nextEmailError || nextPasswordError) return;
    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });
    if (error) {
      setFormError(
        getAuthErrorMessage(error, "That email or password is incorrect."),
      );
      return;
    }
    const needsCodeAfterSubmit =
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor";
    if (signIn.status === "complete") {
      goHome();
    } else if (needsCodeAfterSubmit) {
      await sendEmailCode();
    } else {
      setFormError("We couldn't sign you in. Please try again.");
    }
  };

  const handleVerify = async () => {
    const nextCodeError = validateCode(code);
    setCodeError(nextCodeError);
    setFormError(undefined);
    if (nextCodeError) return;

    const { error } = await signIn.mfa.verifyEmailCode({ code: code.trim() });

    if (error) {
      setFormError(
        getAuthErrorMessage(error, "That code didn't match. Try again."),
      );
      return;
    }

    if (signIn.status === "complete") {
      goHome();
    } else {
      setFormError("We couldn't verify that code. Please try again.");
    }
  };

  const handleResend = async () => {
    setCode("");
    setCodeError(undefined);
    setFormError(undefined);
    await signIn.mfa.sendEmailCode();
  };

  const handleStartOver = () => {
    setCode("");
    setCodeError(undefined);
    setFormError(undefined);
    signIn.reset();
  };

  if (needsCode) {
    return (
      <AuthLayout
        title="Verify it's you"
        subtitle={`Enter the ${VERIFICATION_CODE_LENGTH}-digit code we sent to your email to finish signing in.`}
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
                {isSubmitting ? "Verifying…" : "Verify & continue"}
              </Text>
            </Pressable>

            <Pressable
              className="auth-secondary-button"
              onPress={handleResend}
              disabled={isSubmitting}
            >
              <Text className="auth-secondary-button-text">Resend code</Text>
            </Pressable>

            <Pressable className="auth-link-row" onPress={handleStartOver}>
              <Text className="auth-link">Start over</Text>
            </Pressable>
          </View>
        </View>
      </AuthLayout>
    );
  }

  const canSubmit = Boolean(emailAddress && password) && !isSubmitting;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue managing your subscriptions"
      footer={
        <View className="auth-link-row">
          <Text className="auth-link-copy">New to Recurrly?</Text>
          <Link href="/sign-up" replace>
            <Text className="auth-link">Create account</Text>
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
            error={emailError ?? errors?.fields?.identifier?.message}
          />

          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            textContentType="password"
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
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
