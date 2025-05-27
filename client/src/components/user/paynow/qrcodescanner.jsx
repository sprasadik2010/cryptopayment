import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  const startScanning = () => {
    setScanning(true);
    html5QrCodeRef.current = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const cameraId = devices[0].id;
          html5QrCodeRef.current
            .start(
              cameraId,
              { fps: 10, qrbox: 250 },
              (decodedText) => {
                // Stop scanning after success
                html5QrCodeRef.current
                  .stop()
                  .then(() => {
                    setScanning(false);
                    window.location.href = decodedText; // redirect to scanned URL
                  })
                  .catch((err) => {
                    console.error("Failed to stop scanning", err);
                  });
              },
              (errorMessage) => {
                // optionally log scan errors
                // console.log("QR scan error", errorMessage);
              }
            )
            .catch((err) => {
              console.error("Unable to start scanning", err);
            });
        } else {
          alert("No camera devices found.");
          setScanning(false);
        }
      })
      .catch((err) => {
        console.error("Error getting cameras", err);
        alert("Error accessing cameras.");
        setScanning(false);
      });
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().then(() => {
        setScanning(false);
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!scanning && (
        <button
          onClick={startScanning}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          Scan QR Code
        </button>
      )}

      {scanning && (
        <>
          <div
            id="reader"
            ref={scannerRef}
            style={{ width: "300px", height: "300px" }}
            className="mb-4"
          />
          <button
            onClick={stopScanning}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancel Scan
          </button>
        </>
      )}
    </div>
  );
}
