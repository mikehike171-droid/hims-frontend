"use client"


import Image from 'next/image';

interface DynamicHeaderProps {
  className?: string;
}

export const DynamicHeader: React.FC<DynamicHeaderProps> = ({ className = "" }) => {
  const applicationTitle = 'HIMS - Hospital Information Management System';
  const hospitalName = 'VithYou Hospital Management System';
  const hospitalLogo = '/images/vithyou.png';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {hospitalLogo && (
        <Image
          src={hospitalLogo}
          alt={hospitalName}
          width={40}
          height={40}
          className="rounded-lg"
          onError={(e) => {
            e.currentTarget.src = '/logo.png';
          }}
        />
      )}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{hospitalName}</h1>
      </div>
    </div>
  );
};