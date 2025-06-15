'use client';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import 'react-toastify/dist/ReactToastify.css';


export default function VerifyEmailPage() {
      const [code, setcode] = useState("");
      const [loading, setLoading] = useState(false);
      const [error , setError] = useState("");
      const router = useRouter();


      const notify = (message) => toast(message , {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
          });

          const handleResendCode = async () => {

            const response = await fetch("/api/auth/resend-code", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              }
            });
            const result = await response.json();

            console.log(result);

            if(result.error) {
              notify(result.error);
              return;
            }

            if(result.message) {
              notify(result.message);
              return;
            }

            setError(result?.message || result?.error);

          }
  
          const handleSubmit = async () => {
          
              try {
                setLoading(true);
                  const response = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      code
                    }),
                  });
          
                  const result = await response.json();
                  setLoading(false);
                  
                  if(result.error) {
                    notify(result.error);
                    return;
                  }

                  if(result.message) {
                    notify(result.message);
                    router.push("/");
                    return;
                  }
          
              } catch (error) {
                  console.error(error);
                  notify("Something went wrong");
              }
          }

          if(loading) return <Loader />


  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Verify Your Email</h2>

        {/* Verification Code Field */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-600">Verification Code</label>
          <input
            type="text"
            onChange={(e) => setcode(e.target.value)}
            placeholder="Enter the code sent to your email"
            className="w-full text-gray-700 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-400 focus:outline-none"
          />
        </div>

        {/* Verify Button */}
        <button onClick={handleSubmit} className="mb-4 w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 transition">
          Verify Email
        </button>

        {/* Back to Login Link */}
        <p className="text-center text-sm text-gray-600">
          Wrong email?{' '}
          <Link href="/auth/register" className="font-semibold text-blue-500 hover:underline">
            register again
          </Link>
        </p>
        <p className="text-center text-sm text-gray-600">
          Did not get password?{' '}
          <button onClick={handleResendCode} className="font-semibold text-blue-500 hover:underline">
            resend_code
          </button>
        </p>
      {error? <div className='w-full flex justify-center items-center mt-4 text-sm text-red-500'><span>{error}</span></div> : ""}
      </div>

      <ToastContainer />
    </div>
  );
}
