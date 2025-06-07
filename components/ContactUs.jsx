'use client';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';
import { CldUploadWidget } from 'next-cloudinary'

export default function ContactUsPage() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const notify = (message, type = 'success') => {
    toast(message, {
      type,
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark"
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadedFiles: files, description }),
      cache: "no-store",
    });

    setLoading(false);
    
    const json = await res.json();

    if(json.message) {
      notify(json.message, "success");
      setResponse(json.message);
    } else {
      notify(json.error, "error");
      setResponse(json.error);
    }

    setFiles([]);
    setDescription('');
    setResponse('');

    return;
    
  } catch (err) {
    console.error("Server upload error:", err);
    return null;
  }
  };

  return (
    <div className="w-full flex items-center justify-center px-6 py-8">
      {loading? 

      <div className="w-full flex items-center justify-center px-6 py-8">
    <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
      <ContentLoader
        speed={1.5}
        width={'100%'}
        height={400}
        backgroundColor="#f3f3f3"
        foregroundColor="#e0e0e0"
      >
        {/* Heading */}
        <rect x="0" y="10" rx="4" ry="4" width="60%" height="24" />

        {/* Upload label */}
        <rect x="0" y="60" rx="3" ry="3" width="40%" height="18" />
        <rect x="0" y="85" rx="5" ry="5" width="100%" height="38" />

        {/* Description label */}
        <rect x="0" y="140" rx="3" ry="3" width="50%" height="18" />
        <rect x="0" y="165" rx="5" ry="5" width="100%" height="80" />

        {/* Submit button */}
        <rect x="0" y="260" rx="6" ry="6" width="100%" height="44" />
      </ContentLoader>
    </div>
  </div>
   :
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

        <CldUploadWidget uploadPreset='uploadfiles' onSuccess={({ event, info }) => {
           if (event === "success" && info?.secure_url) {
              setFiles(prevFiles => [...prevFiles, info.secure_url]);
          }
        }}>
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="w-full cursor-pointer border border-gray-300 text-gray-500 rounded p-2 text-left mb-10"
          >
            Upload Files
          </button>

        )}
        </CldUploadWidget>

        {files.length > 0 && (
          <div className="text-green-600 mt-2 mb-4 font-medium">
              ✅ Files uploaded successfully. Now type a description and submit!
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
        {response && 
        <div className='text-sm font-semibold text-gray-700 text-center'>
          {response}
        </div>
        }

        <ToastContainer />
        
      </form>
      }
    </div>
  );
}
