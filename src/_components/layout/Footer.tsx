import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-[#1d417b] py-10 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 w-full text-center">
          <div className="mb-6 flex justify-center">
            {/* Actual logo with white filter */}
            <Image
              src="/logo.svg"
              alt="OpenTask Logo"
              width={78}
              height={31}
              className="brightness-0 invert"
            />
          </div>
          <div className="mx-auto w-full max-w-2xl">
            <h3 className="mb-8 text-xl font-medium text-white">
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

        {/* Decorative Divider */}
        <div className="relative my-12 w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#1d417b] px-6 text-2xl font-light text-gray-400">
              ×
            </span>
          </div>
        </div>

        {/* Links Section */}
        <div className="mb-12 grid w-full grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
          {/* Quick Links */}
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

          {/* Company Links - Column 1 */}
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

          {/* Company Links - Column 2 (Symmetrical) */}
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

        {/* Bottom Section */}
        <div className="w-full border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} OpenTask. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            <Link
              href="/privacy"
              className="inline-block text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-block text-sm text-gray-400 transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
