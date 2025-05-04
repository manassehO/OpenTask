import Image from "next/image";
import Section1 from "../../../../public/section1.png";
import Section2 from "../../../../public/section2.png";

export default function PerksSection() {
  return (
    <div className="mt-4 bg-[#FAFAFA] px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col items-center justify-center">
        <button className="my-3 h-[38px] w-[152px] rounded-[32px] bg-[#D8E6FD66] text-center text-[#3B82F6] lg:my-6">
          benefits
        </button>
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mx-auto text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:w-[618px]">
          The perks you’ll experience along the way
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Lorem ipsum dolor sit amet consectetur. Natoque fermentum nullam
          suspendisse.
        </p>
      </div>

      {/* Section 1 */}
      <div className="mx-auto mt-16 grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div className="relative h-64 w-full md:h-80 lg:h-96">
          <Image
            src={Section1}
            alt="Chart Image"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Zero Risk, Zero Investment
          </h3>
          <p className="mb-6 text-gray-600">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus
            netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Start earning immediately with no upfront costs
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              No need to buy or hold cryptocurrency
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Your earnings are already owned by you
            </li>
          </ul>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mx-auto mt-24 grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1 md:ml-[85px]">
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Familiar & Simple
          </h3>
          <p className="mb-6 text-gray-600">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus
            netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Simple login with your existing account
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Complete familiar tasks you already do
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Begin your earnings in less than 60 seconds
            </li>
          </ul>
        </div>

        <div className="relative order-1 h-64 w-full md:order-2 md:h-80 lg:h-96">
          <Image
            src={Section2}
            alt="Dashboard Image"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <div className="relative flex hidden h-64 w-full items-center justify-center bg-[#ffffff] md:block md:h-80 lg:h-96"></div>
        <div>
          <h3 className="mb-4 text-2xl font-semibold text-gray-900">
            Learn While You Earn
          </h3>
          <p className="mb-6 text-gray-600">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus
            netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Gradual introduction to cryptocurrency
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Educational content embedded naturally
            </li>
            <li className="flex items-start">
              <div className="mr-3 mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
              Progress at your own pace and grow
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
