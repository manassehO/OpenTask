
// app/login/page.tsx
'use client';
import { zodResolver } from '@hookform/resolvers/zod';
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

export default function EmailLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19.5c-5.523 0-10-4.477-10-10a9.99 9.99 0 012.21-6.028M3 3l18 18"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.88 9.88A3 3 0 0114.12 14.12M15 12a3 3 0 00-3-3"
                    />
                  </svg>
                ) : (
                  // eye / visible
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
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
