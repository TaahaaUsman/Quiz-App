"use client";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebook,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Link from "next/link";
import Loader from "./Loader";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const session = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();
      setLoading(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.message) {
        router.push("/");
        return;
      }

      setError("Logged in successfully!");
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    if (session?.data?.user) {
      const alreadyHandled = sessionStorage.getItem("googleLoginHandled");

      if (!alreadyHandled) {
        sessionStorage.setItem("googleLoginHandled", "true");

        const { name, email, image } = session.data.user;

        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register-with-google`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, profilePictureUrl: image }),
          }
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              router.push("/");
            } else {
              setError(data.error || "Something went wrong");
            }
          })
          .catch(() => {
            setError("Google login failed");
          });
      }
    }
  }, [session, router]);

  if (loading) return <Loader />;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-10 py-2 text-gray-700 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 px-10 py-2 pr-10 text-gray-700 focus:outline-none"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="mb-4 w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Or Divider */}
        <div className="relative mb-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-500">
            or continue with
          </div>
        </div>

        {/* Social Buttons */}
        <div className="mb-3 flex flex-col space-y-3">
          <button
            onClick={() => {
              sessionStorage.removeItem("googleLoginHandled");
              signIn("google");
            }}
            className="flex cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 py-2 text-gray-700 hover:bg-gray-100 transition duration-200 transform hover:scale-105"
          >
            <FcGoogle size={20} />
            Login with Google
          </button>
        </div>

        {/* Switch Account */}
        {session?.data?.user && (
          <div className="mb-3 text-center">
            <p className="text-sm text-gray-500">
              Not you?{" "}
              <button
                onClick={() => {
                  sessionStorage.removeItem("googleLoginHandled");
                  signOut({ callbackUrl: "/auth/login" });
                }}
                className="text-blue-500 font-medium hover:underline"
              >
                Switch Account
              </button>
            </p>
          </div>
        )}

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>

        {error && <p className="text-red-600 text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}
