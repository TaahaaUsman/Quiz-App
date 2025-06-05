'use client';
import Link from 'next/link';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

const InputField = ({ label, icon: Icon, type, placeholder, value, onChange, isPassword = false, show = false, toggle = () => {} }) => {
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-600">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Icon />
        </div>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 text-gray-700 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 hover:border-blue-400 focus:outline-none"
        />
        {isPassword && (
          <div
            onClick={toggle}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
          >
            {show ? <FaEyeSlash /> : <FaEye />}
          </div>
        )}
      </div>
    </div>
  );
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !userName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username: userName,
          email,
          password,
          confirmPassword,
        }),
      });

      setLoading(false);

      const result = await response.json();
      console.log(result);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.message) {
        setError(result.message);
        router.push("/auth/verify-email");
        return;
      }

      setError("Something went wrong");

    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    }
  };

  if(loading) return <Loader />

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Create Account</h2>

        <InputField
          label="Name"
          icon={FaUser}
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <InputField
          label="Username"
          icon={FaUser}
          type="text"
          placeholder="Enter your username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <InputField
          label="Email"
          icon={FaEnvelope}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputField
          label="Password"
          icon={FaLock}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isPassword={true}
          show={showPassword}
          toggle={() => setShowPassword(!showPassword)}
        />

        <InputField
          label="Confirm Password"
          icon={FaLock}
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isPassword={true}
          show={showConfirmPassword}
          toggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <button
          className="mb-4 w-full cursor-pointer rounded-md bg-blue-500 py-2 text-white font-semibold hover:bg-blue-600 transition"
          onClick={handleSubmit}
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-blue-500 hover:underline">
            Login
          </Link>
        </p>
        {error? <p className='text-center text-red-600 mt-3'>{error}</p> : ""}
      </div>
    </div>
  );
}
