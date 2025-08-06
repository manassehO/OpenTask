import Faq from '../ui/faq';

function FaqSection() {
  return (
    <div className="flex h-auto w-full flex-col bg-[#FAFAFA] px-[4%] py-8 lg:px-0">
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
          Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam
          imperdiet.
        </p>
      </div>
      <div className="mt-8 flex w-full items-center justify-center">
        <div className="mb-12 max-w-4xl">
          <Faq
            items={faqs}
            answerBgColor="bg-white"
            openTextColor="text-black"
            questionBgColor="bg-white"
            textColor="text-black"
          />
        </div>
      </div>
    </div>
  );
}

export default FaqSection;

const faqs = [
  {
    question: 'What is OpenTask?',
    answer:
      'OpenTask is a platform that lets you complete simple tasks online and earn rewards—no crypto experience or investment needed.',
  },
  {
    question: 'Do I need to pay to join?',
    answer: 'No, OpenTask is free to join and use.',
  },
  {
    question: 'Do I need a crypto wallet to get started?',
    answer: 'No, you can use your email address to get started.',
  },
  {
    question: 'How do I earn rewards?',
    answer:
      'You earn rewards by completing tasks. The more tasks you complete, the more rewards you earn.',
  },
  {
    question: 'What kind of tasks will I find?',
    answer:
      'We offer a variety of tasks, including surveys, quizzes, and more. You can find tasks that match your interests and skills.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Yes, we take your privacy seriously. We never share your data with third parties.',
  },
  {
    question: 'When can I withdraw my rewards?',
    answer:
      'You can withdraw your rewards at any time. Just click the "Withdraw" button in your account dashboard.',
  },
  {
    question: 'Can I use OpenTask from any country?',
    answer:
      'Yes, you can use OpenTask from any country. We are available in many countries around the world.',
  },
];
