type Props = {};

function HeroPage({}: Props) {
  return (
    <div className="flex h-auto w-full flex-col items-center justify-center">
      <span className="text-[64px] font-bold capitalize">
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
      <p className="text-[64px] font-bold capitalize">
        Without Risk or Investment
      </p>

      <div className="mt-8 items-center text-center text-xl font-semibold lg:w-[830px]">
        Complete simple tasks, earn digital rewards, and learn about crypto at
        your own pace - no wallet or technical knowledge required
      </div>
      <div className="items-cener mt-8 flex flex-row gap-6">
        <button className="bg-[#FAFAFA] px-[40px] py-[16px] text-base font-semibold text-[#3B82F6] rounded-[4px]">
          Learn More
        </button>
        <button className="bg-[#3B82F6] px-[40px] py-[16px] text-base font-semibold text-white rounded-[4px]">
          Register
        </button>
      </div>
    </div>
  );
}

export default HeroPage;
