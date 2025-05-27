import { useState, useEffect } from 'react';
import UserNavBar from '../../components/user/common/usernavbar';
import QRCodeDisplay from '../../components/user/paynow/qrcodedisplay';
import ScreenshotUpload from '../../components/user/paynow/screenshotupload';
import QRCodeScanner from '../../components/user/paynow/qrcodescanner';

export default function PayNow() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkIsMobile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavBar />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 mb-5 rounded-lg shadow-md">
          <QRCodeDisplay />

          {/* Only show QR code scanner if on mobile */}
          {isMobile && (
            <div className="mt-6">
              <QRCodeScanner />
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">

          {/* {!isMobile && (
            <p className="text-center text-gray-500 text-sm mt-4">
              To scan a QR code, please open this page on your mobile device.
            </p>
          )} */}

          <div className="mt-6">
            <ScreenshotUpload />
          </div>
        </div>
      </div>
    </div>
  );
}
