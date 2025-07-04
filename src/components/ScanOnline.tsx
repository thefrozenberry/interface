import Image from 'next/image';

const ScanOnline = () => {
  return (
    <div className="bg-black border border-gray-800 rounded-lg p-6">
      <div className="flex flex-col items-center space-y-4">
        <Image 
          src="/QR/qr-code.svg" 
          alt="TouchPay QR Code" 
          width={100}
          height={100}
          className="w-20 h-20"
        />
        <div className="flex flex-col items-center text-center">
          <span className="text-gray-300 text-sm font-medium">try presence</span>
          <span className="text-white text-xl font-bold">snapcheck.</span>
        </div>
      </div>
    </div>
  );
};

export default ScanOnline;
