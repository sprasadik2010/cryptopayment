import { useState } from 'react';

export default function ScreenshotUpload() {
  const [screenshot, setScreenshot] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">Upload Payment Screenshot</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="mb-4"
      />
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