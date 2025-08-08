'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AuthWrapper from '~/_components/layout/authWrapper';
import OTPInput from '~/_components/ui/form/OTPInput';
import { verifyEmail } from '~/lib/auth-client';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

function Otp() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const handleOtpInputChange = (value: number | undefined) => {
    setValue('otp', value?.toString() ?? '');
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      console.log('OTP submitted:', data.otp);
      await verifyEmail({
        query: {
          token: data.otp,
          callbackURL: '/home',
        },
      });
      router.push('/home');
    } catch (error) {
      console.error('OTP verification error:', error);
    }
  };

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
            value={otpValue ? parseInt(otpValue) : undefined}
            // @ts-expect-error - OTPInput has complex type definition
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Proceed'}
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default Otp;
