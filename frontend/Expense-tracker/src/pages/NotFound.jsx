import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-100 p-6">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition">
        Go to Home
      </Link>
    </div>
  );
}
