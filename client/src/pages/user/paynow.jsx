import { useState, useEffect } from 'react';
import UserNavBar from '../../components/user/common/usernavbar';
import QRCodeDisplay from '../../components/user/paynow/qrcodedisplay';
import ScreenshotUpload from '../../components/user/paynow/screenshotupload';

export default function PayNow() {

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavBar />

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white p-6 mb-5 rounded-lg shadow-md">
          <QRCodeDisplay />
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
