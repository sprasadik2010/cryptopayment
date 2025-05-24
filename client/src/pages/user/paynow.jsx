import { useState } from 'react';
import UserNavBar from '../../components/user/common/usernavbar';
import { QrCode } from 'lucide-react';
import QRCodeDisplay from '../../components/user/paynow/qrcodedisplay';
import ScreenshotUpload from '../../components/user/paynow/screenshotupload';

export default function PayNow() {
  return (
    <>
    <UserNavBar/>
    <QRCodeDisplay/>
    <ScreenshotUpload/>
    </>
  );
}
