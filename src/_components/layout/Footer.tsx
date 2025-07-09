import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-[#1d417b] py-10 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex w-full flex-col justify-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo.svg"
              alt="OpenTask Logo"
              width={78}
              height={31}
              className="brightness-0 invert"
            />
          </div>
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center text-center">
            <h3 className="mb-8 max-w-sm text-base font-medium text-white">
              Sign up to our newsletter and get informed on the latest news and
              gist in the marketing world
            </h3>
            <div className="mx-auto flex w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full flex-1 rounded-l-md border border-white/20 bg-white/10 p-3 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="rounded-r-md border border-blue-500 bg-blue-500 px-6 py-3 text-white transition-colors duration-200 ease-in-out hover:bg-blue-600">
                →
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-12 flex w-full max-w-md flex-col items-center justify-between md:flex-row">
            <div className="text-center md:text-left">
              <h4 className="mb-6 text-lg font-semibold text-white">
                Quick Links
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/task"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Task
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h4 className="mb-6 text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/create-task"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Create A Task
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="inline-block text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    Log In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
