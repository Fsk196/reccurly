// Lightweight, brand-agnostic validation + error helpers for the auth flow.
// Keeps screen components focused on UI/flow rather than parsing.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;
export const VERIFICATION_CODE_LENGTH = 6;

export const validateEmail = (value: string): string | undefined => {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
};

export const validatePassword = (value: string): string | undefined => {
  if (!value) return "Enter a password.";
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return undefined;
};

export const validateSignInPassword = (value: string): string | undefined => {
  if (!value) return "Enter your password.";
  return undefined;
};

export const validateCode = (value: string): string | undefined => {
  const code = value.trim();
  if (!code) return "Enter the verification code.";
  if (!/^\d+$/.test(code) || code.length !== VERIFICATION_CODE_LENGTH) {
    return `Enter the ${VERIFICATION_CODE_LENGTH}-digit code we sent you.`;
  }
  return undefined;
};

// Clerk surfaces errors in a few shapes depending on where they originate.
// Pull out the friendliest message we can find, with a safe fallback.
export const getAuthErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  const candidate = error as {
    errors?: { longMessage?: string; message?: string }[];
    longMessage?: string;
    message?: string;
  };

  const firstFieldError = candidate.errors?.[0];
  return (
    firstFieldError?.longMessage ??
    firstFieldError?.message ??
    candidate.longMessage ??
    candidate.message ??
    fallback
  );
};
