import Image from 'next/image';
import Faq from '../ui/faq';
import { motion } from 'framer-motion';

function StartToFinishSection() {
  return (
    <div className="mt-8 flex h-auto w-full flex-col px-[4%] lg:px-0">
      <div className="flex w-full flex-col items-center justify-center">
        <button className="my-3 h-[38px] w-[152px] rounded-[32px] bg-[#D8E6FD66] text-center text-[#3B82F6] lg:my-6">
          how it works
        </button>
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mx-auto text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:w-[618px] lg:text-3xl">
          From Start to Finish – What to Expect
        </h2>
        <p className="mt-4 text-sm text-gray-600 lg:text-lg">
          Join in minutes, pick a task, and get rewarded. No crypto knowledge or
          wallet required.
        </p>
      </div>
      <div className="mt-12 flex w-full items-start justify-center">
        <div className="flex w-full flex-col gap-4 lg:max-w-7xl lg:flex-row">
          <Faq
            questionBgColor="bg-[#FAFAFA]"
            answerBgColor="bg-[#3B82F6]"
            textColor="text-[#414141]"
            openTextColor="text-white"
            items={faqItems}
          />
          <motion.div>
            <Image
              src="/icons/heroStartToFinish.svg"
              alt=""
              className="h-full w-full"
              height={100}
              width={100}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default StartToFinishSection;

const faqItems = [
  {
    question: 'Sign Up Simply',
    answer:
      'Use your existing social account No wallet setup required Instant access to tasks',
  },
  {
    question: 'Choose Your Tasks',
    answer:
      'Use your existing social account No wallet setup required Instant access to tasks',
  },
  {
    question: 'Complete & Earn',
    answer:
      'Use your existing social account No wallet setup required Instant access to tasks',
  },
  {
    question: 'Track & Learn',
    answer:
      'Use your existing social account No wallet setup required Instant access to tasks',
  },
];
