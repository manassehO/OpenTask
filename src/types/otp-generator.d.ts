declare module 'otp-generator' {
  interface OTPOptions {
    upperCaseAlphabets?: boolean;
    specialChars?: boolean;
    digits?: boolean;
    lowerCaseAlphabets?: boolean;
  }

  const generate: (length: number, options?: OTPOptions) => string;

  const _default: { generate: typeof generate };

  export = _default;
}
