"use client";
import { useState } from "react";
import AuthWrapper from "~/_components/layout/authWrapper";
import OTPInput from "~/_components/ui/form/OTPInput";


function Otp() {
  const [otp, setOtp] = useState<number | undefined>(undefined);
  const [error, setError] = useState(false);
  const otpLength = 6;

  const handleChange = (value: number | undefined) => {
    setOtp(value);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp?.toString().length !== otpLength) {
      setError(true);
      return;
    }
  };

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper text="Welcome to open task. Sign in with your email or connect a wallet to get started" title="Welcome">
        <form onSubmit={handleSubmit} className="flex w-96 flex-col gap-4">
          <OTPInput
            value={otp}
            onChange={(value) => handleChange(value as number | undefined)}
            maxLength={otpLength}
            label="OTP"
            placeholder="Enter OTP"
            error={error}
          />
          <button className="rounded-md bg-[#3B82F6] p-4 text-white">
            Proceed
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default Otp;
