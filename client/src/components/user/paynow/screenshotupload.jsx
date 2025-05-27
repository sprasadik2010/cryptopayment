import { useState } from 'react';

export default function ScreenshotUpload() {
  const [screenshot, setScreenshot] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Upload Payment Screenshot</h2>

      {/* File upload styled as link */}
      <label className="text-blue-600 underline cursor-pointer mb-2">
        Choose File
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>

      <p className="mb-4 text-center text-gray-700">{fileName}</p>

      {screenshot && (
        <img
          src={screenshot}
          alt="Uploaded Screenshot"
          className="w-60 h-60 border rounded shadow object-contain"
        />
      )}
    </div>
  );
}
