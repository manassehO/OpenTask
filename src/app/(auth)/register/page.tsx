'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AuthWrapper from '~/_components/layout/authWrapper';
import { signUp } from '~/lib/auth-client';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

function EmailSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log('Form submitted with data:', data);
      await signUp.email({
        email: data.email,
        name: data.email.split('@')[0]!,
        password: data.password,
      });
      //   await emailOtp.sendVerificationOtp({
      //     email: data.email,
      //     type: 'email-verification',
      //   });
      router.push('/otp');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper
        text="Welcome to open task. Sign in with your email or connect a wallet to get started"
        title="Welcome"
        type="signup"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-96 flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`rounded-md border p-4 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className={`rounded-md border p-4 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-[#3B82F6] p-4 text-white hover:bg-[#2563EB] disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Continue'}
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default EmailSignup;
