import Link from "next/link";
import { Metadata } from "next";
import { HomeIcon, BriefcaseIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Linc Group",
  description: "The page you are looking for could not be found.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
          <div className="text-center">
            {/* 404 Large Number */}
            <h1 className="mb-4 text-9xl font-extrabold text-gray-200">404</h1>

            {/* Heading */}
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Page Not Found
            </h2>

            {/* Message */}
            <p className="mb-8 text-lg font-light text-gray-600">
              Sorry, the page you are looking for does not exist or has been moved.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/en"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300"
              >
                <HomeIcon className="h-5 w-5" />
                Back to Home
              </Link>

              <Link
                href="/en/services"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <BriefcaseIcon className="h-5 w-5" />
                Our Services
              </Link>

              <Link
                href="/en/contact-us"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                <EnvelopeIcon className="h-5 w-5" />
                Contact Us
              </Link>
            </div>

            {/* Helpful Links Section */}
            <div className="mt-16">
              <h3 className="mb-6 text-xl font-semibold text-gray-900">
                You might be interested in:
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/en/about-us"
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="mb-2 font-semibold text-gray-900">About Us</h4>
                  <p className="text-sm text-gray-600">Learn more about Linc Group</p>
                </Link>

                <Link
                  href="/en/blog"
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="mb-2 font-semibold text-gray-900">Blog</h4>
                  <p className="text-sm text-gray-600">Read our latest news and articles</p>
                </Link>

                <Link
                  href="/en/career"
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="mb-2 font-semibold text-gray-900">Careers</h4>
                  <p className="text-sm text-gray-600">Join our team and grow with us</p>
                </Link>

                <Link
                  href="/en/services"
                  className="rounded-lg border border-gray-200 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
                >
                  <h4 className="mb-2 font-semibold text-gray-900">Services</h4>
                  <p className="text-sm text-gray-600">Explore our supply chain solutions</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
