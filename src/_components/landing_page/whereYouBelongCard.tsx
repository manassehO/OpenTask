import { motion } from 'framer-motion';
import Image from 'next/image';

import type { Variants } from 'framer-motion';
import { easeOut } from 'framer-motion';
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

export default function WhereYouBelongCard() {
  return (
    <motion.section
      variants={imageVariants}
      initial="hidden"
      whileInView="visible"
      className="flex h-auto w-full items-center justify-center"
    >
      <div className="relative my-16 flex h-[340px] w-full flex-col items-center justify-between gap-4 bg-[#3B82F6] p-12 text-white lg:h-[485px] lg:max-w-7xl lg:flex-row lg:rounded-lg">
        <div>
          <button className="my-3 h-[38px] rounded-[32px] bg-transparent/50 px-4 text-center text-xs text-white md:text-sm lg:my-6 lg:text-base">
            Join our community
          </button>
          <p className="text-start text-xl font-bold text-white md:text-[30px] lg:text-[37px]">
            Where You Belong, Where <br /> You’ll Thrive. Together, We Rise.
          </p>
          <p className="text-sm font-normal text-[#FFFFFFCC] md:text-base md:font-medium lg:text-lg">
            Where You Belong, Where You’ll Thrive. Together, We Rise.
          </p>
        </div>

        <GetStarted
          component={
            <button className="z-50 my-3 h-[53px] w-[182px] rounded-[4px] bg-white text-center text-[#3B82F6] lg:my-6">
              Register Now
            </button>
          }
        />

        <Image
          src="/icons/leftFlowe.svg"
          className="absolute left-0 hidden lg:block lg:h-auto lg:w-auto"
          alt=""
          height={0}
          width={0}
        />
        <Image
          src="/icons/rightFlower.svg"
          className="absolute -right-0 -top-0 h-[80%] w-[80%] lg:right-0 lg:top-0 lg:h-auto lg:w-auto"
          alt=""
          height={0}
          width={0}
        />
      </div>
    </motion.section>
  );
}
