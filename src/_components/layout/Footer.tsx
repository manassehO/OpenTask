import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1d417b] text-white py-10 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="w-full mb-12 text-center">
          <div className="flex justify-center mb-6">
            {/* Actual logo with white filter */}
            <Image
              src="/logo.svg"
              alt="OpenTask Logo"
              width={78}
              height={31}
              className="brightness-0 invert"
            />
          </div>
          <div className="w-full max-w-2xl mx-auto">
            <h3 className="text-xl font-medium mb-8 text-white">
              Sign up to our newsletter and get informed on the latest news and gist in the marketing world
            </h3>
            <div className="w-full max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full flex-1 p-3 rounded-l-md bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 border border-white/20"
              />
              <button 
                className="px-6 py-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors duration-200 ease-in-out border border-blue-500"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative w-full my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 text-2xl font-light text-gray-400 bg-[#1d417b]">×</span>
          </div>
        </div>

        {/* Links Section */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 mb-12">
          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/task" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Task
                </Link>
              </li>
              <li>
                <Link 
                  href="/faqs" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links - Column 1 */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/create-task" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Create A Task
                </Link>
              </li>
              <li>
                <Link 
                  href="/signup" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links - Column 2 (Symmetrical) */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/create-task" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Create A Task
                </Link>
              </li>
              <li>
                <Link 
                  href="/signup" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="inline-block text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full border-t border-white/20 pt-8 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} OpenTask. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link 
              href="/privacy" 
              className="inline-block text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="inline-block text-sm text-gray-400 hover:text-white transition-colors duration-200"
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