import Image from 'next/image';
import Section1 from '../../../public/section1.png';
import Section2 from '../../../public/section2.png';

export default function PerksPage() {
  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8 mt-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:w-[618px] mx-auto">
          The perks you’ll experience along the way
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Lorem ipsum dolor sit amet consectetur. Natoque fermentum nullam suspendisse.
        </p>
      </div>

      {/* Section 1 */}
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mt-16">
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <Image 
            src={Section1}
            alt="Chart Image"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Zero Risk, Zero Investment
          </h3>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Start earning immediately with no upfront costs
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              No need to buy or hold cryptocurrency
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Your earnings are already owned by you
            </li>
          </ul>
        </div>
      </div>

      {/* Section 2 */}
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto mt-24">
        <div className="order-2 md:order-1 md:ml-[85px] ">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Familiar & Simple
          </h3>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Simple login with your existing account
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Complete familiar tasks you already do
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Begin your earnings in less than 60 seconds
            </li>
          </ul>
        </div>

        <div className="order-1 md:order-2 relative w-full h-64 md:h-80 lg:h-96">
          <Image 
            src={Section2}
            alt="Dashboard Image"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <div className="relative hidden md:block w-full h-64 md:h-80 lg:h-96 bg-[#ffffff] flex items-center justify-center">
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Learn While You Earn
          </h3>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet consectetur. Amet cras mus ridiculus netus feugiat faucibus varius habitant.
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Gradual introduction to cryptocurrency
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Educational content embedded naturally
            </li>
            <li className="flex items-start">
              <div className="w-3 h-3 mt-2 bg-blue-500 rounded-full mr-3"></div>
              Progress at your own pace and grow
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
