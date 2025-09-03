'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
          onSuccess: (res) => {
            toast.success('OTP verified successfully!');
            const { data } = res;

            if (resetEmail) {
              // Handle password reset flow
              localStorage.setItem(
                'reset_password',
                JSON.stringify({ otp: data.otp, email: targetEmail }),
              );
              router.push('/reset-password'); // Redirect to password reset page
            } else {
              // Handle regular login flow
              // router.push('/home');

              const rootRoute = getKeyByValue(UserType, data?.user?.role);
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

  // Add console logs for debugging
  console.log('Current OTP value:', otpValue);
  console.log('Email from params:', email);
  console.log('Reset email from params:', resetEmail);

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper
        text="Welcome to open task. Sign in with your email or connect a wallet to get started"
        title="Welcome"
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
        </form>
      </AuthWrapper>
    </div>
  );
}

export default Otp;
