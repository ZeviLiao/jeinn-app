export default function Home() {
  return (
    <div className="container flex items-center p-4 mx-auto min-h-screen justify-center">
      <main>
        <div className="text-right">
          <h1 className="font-mono text-2xl code">
            Welcome to <span className="text-purple-700">Nextjs</span>,{" "}
            <span className="text-indigo-700">TailwindCSS</span> and{" "}
            <span className="text-gray-700">TypeScript</span>
          </h1>
          <h1 className="font-mono text-2xl code">
            <div className="text-gray-700">Restful API Provided</div>
          </h1>
          <h1 className="font-mono text-xl code mt-4 text-gray-600">
            • 捷伊雲 \ JeInn
          </h1>
        </div>
      </main>
    </div>
  );
}
