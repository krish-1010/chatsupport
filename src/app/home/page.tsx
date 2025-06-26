import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src={"/imgs/loyolaclg.jpeg"}
        alt="loyola"
        className="object-cover z-10"
        priority
        fill
      />
      <div className="absolute inset-0 bg-gray-900 opacity-50 z-10" />
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Let your light shine!
        </h1>
        <h2 className="text-xl md:text-2xl italic">Loyola-vin oli veesatum!</h2>
        <div className="flex gap-2 mt-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Main Page
          </Link>

          <Link
            href="/about"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
