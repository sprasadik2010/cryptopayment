import { useState } from 'react';

export default function ScreenshotUpload() {
  const [screenshot, setScreenshot] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentuser"));

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setScreenshot(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setSelectedFile(null);
      setScreenshot(null);
      setFileName("No file chosen");
    }
  };

  const handleUpload = async () => {    
      if (!currentUser) return;
    if (!selectedFile || uploading) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile); // Match FastAPI parameter

    try {
      const response = await fetch(`${import.meta.env.VITE_CRYPTO_PAYMENT_API_BASE_URL}/upload-payment-proof/${currentUser.username}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      console.log("Upload success:", result);
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Upload Payment Screenshot</h2>

      {/* Choose File */}
      <label className="text-blue-600 underline cursor-pointer mb-2">
        Choose File
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      <p className="mb-4 text-center text-gray-700">{fileName}</p>

      {screenshot && (
        <>
          <img
            src={screenshot}
            alt="Uploaded Screenshot"
            className="w-60 h-60 border rounded shadow object-contain"
          />

          {/* Upload Button */}
          <button
            disabled={uploading}
            onClick={handleUpload}
            className={`mt-2 px-4 py-2 bg-blue-500 text-white rounded ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </>
      )}
    </div>
  );
}
