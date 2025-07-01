import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logos/utmist-logo-small.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="w-full max-w-md text-center">
        <div className="bg-white p-8 rounded-2xl border border-[var(--gray3)] shadow-sm space-y-6">
          <div className="flex flex-col items-center">
            <Image
              src={logo}
              alt="UTMIST Logo"
              width={48}
              height={48}
              className="mb-4"
            />
            <h1 className="text-6xl font-bold text-[var(--secondary)] font-[var(--font-space-grotesk)]">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-black font-[var(--font-space-grotesk)] mt-2">
              Page Not Found
            </h2>
            <p className="text-[var(--gray4)] font-[var(--system-font)] mt-4">
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[var(--secondary)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-all font-[var(--system-font)]"
            >
              Go Home
            </Link>

            <Link
              href="/dashboard"
              className="w-full flex justify-center py-3 px-4 border border-[var(--gray3)] rounded-lg shadow-sm text-sm font-medium text-[var(--gray4)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--secondary)] transition-all font-[var(--system-font)]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
