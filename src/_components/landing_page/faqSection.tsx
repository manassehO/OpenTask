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
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
  {
    question: 'Lorem ipsum dolor sit amet consectetur?',
    answer:
      'Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.',
  },
];
