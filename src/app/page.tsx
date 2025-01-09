import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-r from-indigo-500 via-purple-50 to-pink-50">
      <h1 className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        Hi there
      </h1>
      <h2 className="text-3xl font-bold tracking-tight text-center lg:text-4xl bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mt-2">
        Want to create a thumbnail?
      </h2>

      <div className="flex flex-col items-center gap-3 mt-6 text-center">
        <p className="leading-7 text-gray-700">
          Take a look at our plans to continue generating thumbnails
        </p>
        <div className="flex gap-4 items-center justify-center mt-4">
          <Link href="/dashboard">
            <Button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg">
              Free Trial
            </Button>
          </Link>
          <Link href="/pricing">
            <Button className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow-lg">
              Buy Subscription
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-10">
        <span className="text-lg font-medium text-gray-600">
          Here are some of our thumbnail demos:
        </span>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <img
              key={index}
              src={`/thumbnail(${index + 1}).png`}
              alt={`Thumbnail ${index + 1}`}
              className="w-[400px] h-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
