import { useState, useEffect } from 'react';
import UserNavBar from '../../components/user/common/usernavbar';
import QRCodeDisplay from '../../components/user/paynow/qrcodedisplay';
import ScreenshotUpload from '../../components/user/paynow/screenshotupload';

export default function PayNow() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentuser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if (!currentUser) return null; // or a loading spinner

  return (
    <div className="min-h-screen bg-gray-100">
      <UserNavBar />

      {!currentUser.paid && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white p-6 mb-5 rounded-lg shadow-md">
            <QRCodeDisplay />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mt-6">
              <ScreenshotUpload />
            </div>
          </div>
        </div>
      )}

      {currentUser.paid && (
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white p-6 mb-5 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Your payment screenshot</h2>
            <iframe
              src={`https://drive.google.com/file/d/${currentUser.paymentproof}/preview`}
              width="100%"
              height="480"
              allow="autoplay"
            />
          </div>
        </div>
        )}
    </div>
  );
}
