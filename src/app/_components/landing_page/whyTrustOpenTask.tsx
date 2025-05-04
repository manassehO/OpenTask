import Image from "next/image";

export default function WhyTrustOpenTask() {
  return (
    <div className="mt-8 flex h-auto w-full flex-col items-center justify-center bg-[#FAFAFA] px-[4%] lg:px-0">
      <div className="flex w-full flex-col items-center justify-center">
        <button className="my-3 h-[38px] rounded-[32px] bg-[#D8E6FD66] px-4 text-center text-[#3B82F6] lg:my-6">
          Why Trust OpenTask
        </button>
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mx-auto text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl md:w-[618px] lg:text-[40px]">
          Why OpenTask Became the Name You Can Rely On
        </h2>
        <p className="mt-4 text-sm text-gray-600 lg:text-lg">
          Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam
          imperdiet.
        </p>
      </div>
      <div className="mt-12 flex max-w-7xl flex-col items-center gap-4 rounded-md">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card
            text="Lorem ipsum dolor sit amet consectetur. Amet elit eget amet rhoncus viverra. dolor sit amet consectetur"
            src="/icons/security.svg"
            title="Secure OAuth authentication"
          />
          <Card
            src="/icons/wallet.svg"
            text="Lorem ipsum dolor sit amet consectetur. Amet elit eget amet rhoncus viverra. dolor sit amet consectetur"
            title="No wallet required to start"
          />
          <Card
            src="/icons/locAtm.svg"
            text="Lorem ipsum dolor sit amet consectetur. Amet elit eget amet rhoncus viverra. dolor sit amet consectetur"
            title="Your earnings are safely stored"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card
            src="/icons/airline.svg"
            text="Lorem ipsum dolor sit amet consectetur. Amet elit eget amet rhoncus viverra. dolor sit amet consectetur sit amet consectetur. Amet elit"
            title="Clear, step-by-step instructions"
          />
          <Card
            src="/icons/document.svg"
            text="Lorem ipsum dolor sit amet consectetur. Amet elit eget amet rhoncus viverra. dolor sit amet consectetur sit amet consectetur. Amet elit"
            title="Support available 24/7"
          />
        </div>
        <button className="my-12 rounded-md bg-[#3B82F6] p-4 text-white">
          See available task now
        </button>
      </div>
    </div>
  );
}

const Card = ({
  title,
  src,
  text,
}: {
  title: string;
  src: string;
  text: string;
}) => {
  return (
    <div className="flex h-[236px] w-auto flex-col justify-center gap-5 bg-white p-5">
      <div className="w-fit rounded-[4px] bg-[#3B82F6] p-2">
        <Image src={src} alt="" width={20} height={20} />
      </div>

      <div>
        <p className="text-lg font-bold capitalize text-black lg:text-2xl">
          {title}
        </p>
        <p className="text-xs font-medium text-[#414141] lg:text-sm">{text}</p>
      </div>
      <button className="text-start text-sm font-medium text-[#3B82F6] lg:text-base">
        Get Started
      </button>
    </div>
  );
};
