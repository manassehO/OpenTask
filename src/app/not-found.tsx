import Link from 'next/link';
import Footer from '~/_components/layout/Footer';
import { Navbar } from '~/_components/layout/navbar';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-white">
      <Navbar />
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 text-6xl font-bold text-[#3B82F6]">404</h1>
        <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-6 max-w-md text-gray-600">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-[#3B82F6] px-6 py-3 font-medium text-white transition-colors hover:bg-[#3B82F6]/80 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2"
        >
          Go to Homepage
        </Link>
      </section>
      <Footer />
    </main>
  );
}
