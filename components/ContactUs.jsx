'use client';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ContentLoader from 'react-content-loader';

export default function ContactUsPage() {
  const [files, setFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);


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
      // Upload files one by one to Cloudinary
      const uploadedFilesUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'your_upload_preset'); // Important
        formData.append('cloud_name', 'your_cloud_name');

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload',
          formData
        );

        uploadedFilesUrls.push(response.data.secure_url);
      }

      // Now send the uploaded file URLs + description to backend
      const sendToBackend = await axios.post('/api/contact', {
        uploadedFiles: uploadedFilesUrls,
        description: description,
      });

      if (sendToBackend.data.success) {
        notify("Submitted successfully!");
        setFiles([]);
        setDescription('');
      } else {
        notify(sendToBackend.data.message || "Something went wrong!", "error");
      }

    } catch (error) {
      console.error(error);
      notify("Upload failed!", "error");
    } finally {
      setLoading(false);
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Upload Files</label>
          <input
  type="file"
  multiple
  onChange={(e) => setFiles(Array.from(e.target.files))}
  className="w-full border border-gray-300 rounded p-2"
/>

        </div>

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

        <ToastContainer />
      </form>
      }
    </div>
  );
}
