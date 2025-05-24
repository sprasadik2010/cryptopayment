import QrCodeImg from "../../../assets/qrcode.jpeg";
export default function QRCodeDisplay() {
  return (
    <div className="flex flex-col items-center mb-8">
      <h2 className="text-xl font-semibold mb-2">Scan to Pay</h2>
      <img
        src="/qrcode.png"//{QrCodeImg} // Replace with your actual QR code path
        alt="Payment QR Code"
        className="w-60 border rounded shadow"
      />
    </div>
  );
}