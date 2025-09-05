import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Dropsos
        </h1>
        <div className="space-x-6">
          <Link href="/" className="hover:text-blue-200 transition-colors font-medium">Home</Link>
          <Link href="/about" className="hover:text-blue-200 transition-colors font-medium">About</Link>
          <Link href="/blog" className="hover:text-blue-200 transition-colors font-medium">Blog</Link>
        </div>
      </div>
    </nav>
  );
}