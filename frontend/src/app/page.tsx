export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex min-h-screen flex-col items-center justify-center px-24 py-32">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Next.js Frontend
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your Next.js frontend is successfully connected to Strapi backend
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <a
                href="https://nextjs.org/docs"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js Docs
              </a>
              <a
                href="https://strapi.io/documentation"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Strapi Docs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
