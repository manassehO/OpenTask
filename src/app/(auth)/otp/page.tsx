/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import AuthWrapper from '~/_components/layout/authWrapper';
import OTPInput from '~/_components/ui/form/OTPInput';
import { authClient } from '~/lib/auth-client';
import { getKeyByValue } from '~/lib/fns';
import { routes } from '~/lib/route';
import { UserType } from '~/lib/utils';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

function Otp() {
  const searchParams = useSearchParams();
  const resetEmail = searchParams.get('reset_email');
  const email = searchParams.get('email')!;
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const {
    // register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const router = useRouter();
  const otpValue = watch('otp');
  const otpLength = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOtpInputChange = (value: string) => {
    setValue('otp', value);
  };

  const [timer, setTimer] = useState(60); // 60 seconds (1 minute)

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Format function: converts seconds -> mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleResendOtp = async () => {
    setIsSendingOtp(true);
    try {
      const newOtp = await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: 'email-verification',
      });

      if (!newOtp.data?.success) {
        throw new Error('error while trying to send otp');
        toast.error('Email not found');
        return;
      }

      toast.success('OTP resent successfully!');
      setTimer(60);
    } catch (err: unknown) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);

    try {
      // Determine which email to use
      const targetEmail = resetEmail ?? email;

      if (!targetEmail) {
        toast.error('Email not found');
        setIsSubmitting(false);
        return;
      }

      await authClient.emailOtp.verifyEmail(
        {
          otp: data.otp,
          email: targetEmail,
        },
        {
          onSuccess: async (res) => {
            toast.success('OTP verified successfully!');
            const { data } = res;
            const userRole = await authClient.getSession();

            if (resetEmail) {
              // Handle password reset flow
              localStorage.setItem(
                'reset_password',
                JSON.stringify({ otp: data.otp, email: targetEmail }),
              );
              router.push('/reset-password'); // Redirect to password reset page
            } else {
              // Handle regular login flow
              const rootRoute = getKeyByValue(
                UserType,
                userRole?.data?.user?.role ?? '',
              );
              if (rootRoute)
                router.push(
                  routes?.[rootRoute?.toLowerCase() as keyof typeof routes]
                    ?.root,
                );
            }
          },
          onError: (err) => {
            console.error('OTP verification error:', err);
            toast.error('Invalid OTP. Please try again.');
          },
        },
      );
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper
        text="Welcome to open task. Sign in with your email or connect a wallet to get started"
        title="Welcome"
        google={false}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96 flex-col gap-4"
        >
          <OTPInput
            value={otpValue}
            onChange={handleOtpInputChange}
            maxLength={otpLength}
            label="OTP"
            placeholder="Enter OTP"
            error={!!errors.otp}
          />
          {errors.otp && (
            <p className="text-sm text-red-500">{errors.otp.message}</p>
          )}
          <button
            type="submit"
            className="rounded-md bg-[#3B82F6] p-4 text-white hover:bg-[#2563EB] disabled:opacity-50"
            disabled={isSubmitting || otpValue.length !== 6}
          >
            {isSubmitting ? 'Verifying...' : 'Proceed'}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timer > 0}
            className="rounded-md p-3 text-primary disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {isSendingOtp
              ? 'sending...'
              : timer > 0
                ? `Resend OTP in ${formatTime(timer)}`
                : 'Resend OTP'}
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default Otp;
