export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-[60vh] mx-auto max-w-xl px-6 py-16 text-white bg-black">
      <h1 className="text-2xl font-semibold mb-4">Authentication Error</h1>
      <p className="text-gray-300 mb-6">
        We couldn&apos;t complete your sign-in. Please try again, or return to the sign-in page and
        start the Discord login flow once more.
      </p>
      <a
        href="/sign-in"
        className="inline-flex rounded-md bg-[#5865F2] px-4 py-2 text-white hover:bg-[#4752C4]"
      >
        Back to Sign In
      </a>
    </main>
  )
}
