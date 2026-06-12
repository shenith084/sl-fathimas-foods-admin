import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404 — Page Not Found" };

export default function NotFound() {
  return (
    <div className="bg-[#FAF7F2] min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-8xl mb-6">🍛</div>
        <h1 className="font-display font-bold text-[#222] text-5xl mb-2">404</h1>
        <h2 className="font-display font-semibold text-[#2C4631] text-xl mb-4">Page not found</h2>
        <p className="text-[#666] max-w-sm mx-auto mb-8">
          Oops! Looks like this page went on a food journey and got lost. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-[#D98C1F] hover:bg-[#B8740F] text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 shadow-md">
            Back to Home
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 border-2 border-[#2C4631] text-[#2C4631] hover:bg-[#2C4631] hover:text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
