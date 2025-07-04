'use client';
import { useState } from 'react';
import AuthWrapper from '~/_components/layout/authWrapper';

function EmailLogin() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState({
    email: false,
    emailMessage: '',
  });

  // Standard email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear email error when user types
    if (error.email) {
      setError({
        email: false,
        emailMessage: '',
      });
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError({
        email: true,
        emailMessage: 'Email is required',
      });
      return false;
    }

    if (!emailRegex.test(email)) {
      setError({
        email: true,
        emailMessage: 'Please enter a valid email address',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isEmailValid = validateEmail();

    if (!isEmailValid) {
      return;
    }

    // Proceed with form submission if email is valid
    console.log('Form submitted with email:', email);
  };

  return (
    <div className="flex h-svh w-full items-center justify-center">
      <AuthWrapper
        text="Welcome to open task. Sign in with your email or connect a wallet to get started"
        title="Welcome"
      >
        <form onSubmit={handleSubmit} className="flex w-96 flex-col gap-4">
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
              value={email}
              onChange={handleEmailChange}
              onBlur={validateEmail}
              className={`rounded-md border p-4 ${error.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your email"
              required
            />
            {error.email && (
              <p className="text-sm text-red-500">{error.emailMessage}</p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-md bg-[#3B82F6] p-4 text-white hover:bg-[#2563EB]"
            disabled={!email}
          >
            Continue
          </button>
        </form>
      </AuthWrapper>
    </div>
  );
}

export default EmailLogin;
