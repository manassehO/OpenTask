'use client';
import type { Variants } from 'framer-motion';
import { easeOut, motion } from 'framer-motion';
import Image from 'next/image';
import { containerVariants } from '~/lib/animations';
import GetStarted from '../layout/GetStarted';

const imageVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut, // ✅ Correct type
    },
  },
};

function HeroPage() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      className="mt-[20px] flex h-auto w-full flex-col items-center justify-center lg:mt-[50px]"
    >
      <span className="text-[24px] font-bold capitalize md:text-[32px] lg:text-[64px]">
        Earn Real{' '}
        <span
          className="inline-block rounded-[4px] bg-[#3B82F6] p-1"
          style={{ transform: 'rotate(-1.7deg)' }}
        >
          <p
            style={{ transform: 'rotate(1.7deg)' }}
            className="inline-block text-white"
          >
            Cryptocurrency
          </p>
        </span>
      </span>
      <p className="text-[24px] font-semibold capitalize md:text-[32px] lg:text-[64px] lg:font-bold">
        Without Risk or Investment
      </p>

      <div className="mt-8 items-center px-2 text-center text-lg font-semibold lg:w-[830px] lg:text-xl">
        Complete simple tasks, earn digital rewards, and learn about crypto at
        your own pace - no wallet or technical knowledge required
      </div>
      <div className="items-cener mt-8 flex flex-row gap-6">
        <button className="rounded-[4px] bg-[#FAFAFA] px-[20px] py-[8px] text-base font-semibold text-[#3B82F6] lg:px-[40px] lg:py-[16px]">
          Learn More
        </button>

        <GetStarted
          component={
            <button className="rounded-[4px] bg-[#3B82F6] px-[20px] py-[8px] text-base font-semibold text-white lg:px-[40px] lg:py-[16px]">
              Register
            </button>
          }
        />
      </div>

      <motion.div
        variants={imageVariants}
        className="mt-[80px] h-auto w-[80%] lg:mt-[150px]"
      >
        <Image
          width={100}
          height={100}
          src="/icons/hero.svg"
          alt=""
          className="h-full w-full"
        />
      </motion.div>
    </motion.section>
  );
}

export default HeroPage;
