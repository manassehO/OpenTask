import Image from "next/image";



function HeroPage() {
  return (
    <div className="lg:mt-[50px] mt-[20px] flex h-auto w-full flex-col items-center justify-center">
      <span className="text-[24px] font-bold capitalize md:text-[32px] lg:text-[64px]">
        Earn Real{" "}
        <span
          className="inline-block rounded-[4px] bg-[#3B82F6] p-1"
          style={{ transform: "rotate(-1.7deg)" }}
        >
          <p
            style={{ transform: "rotate(1.7deg)" }}
            className="inline-block text-white"
          >
            Cryptocurrency
          </p>
        </span>
      </span>
      <p className="text-[24px] font-semibold capitalize md:text-[32px] lg:text-[64px] lg:font-bold">
        Without Risk or Investment
      </p>

      <div className="mt-8 items-center text-center px-2 text-lg font-semibold lg:w-[830px] lg:text-xl">
        Complete simple tasks, earn digital rewards, and learn about crypto at
        your own pace - no wallet or technical knowledge required
      </div>
      <div className="items-cener mt-8 flex flex-row gap-6">
        <button className="rounded-[4px] bg-[#FAFAFA] lg:px-[40px] py-[8px] px-[20px] lg:py-[16px] text-base font-semibold text-[#3B82F6]">
          Learn More
        </button>
        <button className="rounded-[4px] bg-[#3B82F6] px-[20px] lg:px-[40px] py-[8px] lg:py-[16px] text-base font-semibold text-white">
          Register
        </button>
      </div>
      <div className="lg:mt-[150px] mt-[80px] h-auto w-[80%]">
        <Image
          width={100}
          height={100}
          src="/icons/hero.svg"
          alt=""
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

export default HeroPage;
