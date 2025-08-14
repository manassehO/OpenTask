import Image from 'next/image';
import React, { type ReactNode } from 'react';
import Button from '../ui/button';

type AuthWrapperProps = {
  children: ReactNode;
  title?: string;
  text: string;
  type?: 'login' | 'signup';
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  children,
  title,
  text,
  type,
}) => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-transparent p-[2%] lg:flex-row">
      <div className="hidden flex-col items-center justify-center gap-5 rounded-lg bg-gradient-to-b from-[#3B82F6] to-[#2757A4] lg:flex lg:w-[40%]">
        <Image src="/auth/authbadge.svg" alt="" width={410} height={410} />
        <div className="flex max-w-[546px] flex-col items-center justify-between gap-4">
          <p className="text-start text-[44px] font-extrabold text-white">
            Complete simple tasks, earn rewards
          </p>
          <p className="text-start text-xl font-medium text-white">
            Discover a seamless way to earn rewards by completing everyday
            tasks, with no prior experience or upfront investment required.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center gap-4 p-6 lg:w-[55%]">
        <div className="w-full max-w-md">
          <p className="text-blaxk text-[40px] font-semibold">{title}</p>
          <p className="text-base font-normal text-black">{text}</p>
        </div>

        <div className="mt-8 w-full max-w-md">{children}</div>
        <div className="flex w-full max-w-md flex-col items-start justify-center gap-4">
          <div className="flex w-full items-center justify-center">
            <p className="text-center text-base font-medium text-black">
              Or Continue With
            </p>
          </div>
          <Button
            icon="/auth/google.svg"
            iconPosition="left"
            iconAlt="Google"
            backgroundColor="bg-[#FAFAFA]"
            borderColor="border-[#DFE5EF]"
            rounded="rounded-[4px]"
            textColor="text-black "
            className="w-96"
          >
            Google
          </Button>
          <Button
            icon="/auth/card1.png"
            iconPosition="left"
            iconAlt="card"
            backgroundColor="bg-[#FAFAFA]"
            borderColor="border-[#DFE5EF]"
            rounded="rounded-[4px]"
            textColor="text-black "
            className="w-96"
          >
            Log in with wallet
          </Button>
          <Button
            backgroundColor="bg-[#FAFAFA]"
            borderColor="border-[#DFE5EF]"
            rounded="rounded-[4px]"
            textColor="text-black "
            className="w-96"
          >
            🔑 Linked passkey
          </Button>
          <div className="mt-8 flex w-full items-center text-xs font-medium text-black">
            By {type !== 'login' ? 'signing up' : 'signing in'}, you agree to
            OpenTask’s
            <button className="text-[#3B82F6]">Terms of service</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthWrapper;
