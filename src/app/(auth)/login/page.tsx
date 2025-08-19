// app/login/page.tsx
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { EyeIcon, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AuthWrapper from '~/_components/layout/authWrapper';
import { signIn } from '~/lib/auth-client';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function EmailLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Form submitted with data:', data);

      await signIn.email({
        email: data.email,
        password: data.password,
      });
      router.push('/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper
        type="login"
        text="Welcome to open task. Sign in with your email or connect a wallet to get started"
        title="Welcome"
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

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                className={`w-full rounded-md border p-4 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your password"
                aria-invalid={errors.password ? 'true' : 'false'}
              />

              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-2 flex items-center justify-center px-2"
              >
                {showPassword ? (
                  // eye-off / hidden
                  <EyeIcon />
                ) : (
                  // eye / visible
                  <EyeOff />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            <Link
              href="/forget_password"
              className="font-medium text-[#3B82F6] hover:text-[#2563EB]"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="rounded-md bg-[#3B82F6] p-4 text-white hover:bg-[#2563EB] disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Continue'}
          </button>
          <div className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-[#3B82F6] hover:text-[#2563EB]"
            >
              Register
            </Link>
          </div>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default EmailLogin;
