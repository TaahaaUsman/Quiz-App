"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CldUploadWidget } from "next-cloudinary";

export default function ContactUsPage() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const notify = (message, type = "success") => {
    toast(message, {
      type,
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length || !description.trim()) {
      notify("Please select files and write description.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadedFiles: files, description }),
        credentials: "include",
        cache: "no-store",
      });

      const json = await res.json();

      if (json.message) {
        notify(json.message, "success");
        setResponse(json.message);
      } else {
        notify(json.error, "error");
        setResponse(json.error);
      }

      setFiles([]);
      setDescription("");
    } catch (err) {
      console.error("Server upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-6 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md"
      >
        {loading ? (
          <>
            <Skeleton height={30} width={150} className="mb-6" />
            <Skeleton height={44} className="mb-6" />
            <Skeleton height={20} width={100} className="mb-2" />
            <Skeleton height={100} className="mb-6" />
            <Skeleton height={44} />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

            <CldUploadWidget
              uploadPreset="uploadfiles"
              onSuccess={({ event, info }) => {
                if (event === "success" && info?.secure_url) {
                  setFiles((prevFiles) => [...prevFiles, info.secure_url]);
                }
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="w-full cursor-pointer border border-gray-300 text-gray-500 rounded p-2 text-left mb-10"
                >
                  📤 Upload Files
                </button>
              )}
            </CldUploadWidget>

            {files.length > 0 && (
              <div className="text-green-600 mt-2 mb-4 font-medium">
                ✅ Files added successfully. Now type a description and submit!
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                className="w-full border border-gray-300 rounded p-2 resize-none"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
            >
              {loading ? "Sending..." : "Submit"}
            </button>

            {response && (
              <div className="text-sm font-semibold text-gray-700 text-center mt-4">
                {response}
              </div>
            )}
          </>
        )}

        <ToastContainer />
      </form>
    </div>
  );
}
