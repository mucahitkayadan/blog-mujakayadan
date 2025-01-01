import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Muja Kayadan's Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome to my personal blog where I share my thoughts and experiences
        </p>
      </header>

      <main className="max-w-3xl">
        {/* Example blog post preview */}
        <article className="mb-12">
          <h2 className="text-2xl font-bold mb-2">
            <a href="/posts/first-post" className="hover:underline">
              My First Blog Post
            </a>
          </h2>
          <div className="text-sm text-gray-500 mb-4">Posted on January 1, 2024</div>
          <p className="text-gray-700 dark:text-gray-200">
            This is a preview of my first blog post. Click to read more...
          </p>
        </article>

        {/* You can add more blog post previews here */}
      </main>
    </div>
  );
}
