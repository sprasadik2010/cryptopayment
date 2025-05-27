import { useState } from 'react';

export default function ScreenshotUpload() {
  const [screenshot, setScreenshot] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState(null); // Save the selected file

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
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile); // Match FastAPI parameter

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      console.log("Upload success:", result);
    } catch (err) {
      console.error("Upload error:", err);
    }
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
            onClick={handleUpload}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
}
