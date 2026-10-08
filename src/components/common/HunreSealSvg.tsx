import React from 'react';

interface SealProps {
  size?: number;
  signedDate?: string;
  signerName?: string;
  isVerified?: boolean;
  className?: string;
}

export const HunreEmblemBadge: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle */}
      <circle cx="50" cy="50" r="47" stroke="#047857" strokeWidth="4" fill="#ECFDF5" />
      <circle cx="50" cy="50" r="42" stroke="#065F46" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
      
      {/* Globe & Leaves Motifs representing Natural Resources & Environment */}
      <path
        d="M25 50 C25 65 35 76 50 76 C65 76 75 65 75 50 C75 35 65 24 50 24 C35 24 25 35 25 50 Z"
        fill="#10B981"
        fillOpacity="0.2"
      />
      <circle cx="50" cy="50" r="22" stroke="#059669" strokeWidth="2" fill="#FFFFFF" />
      <ellipse cx="50" cy="50" rx="10" ry="22" stroke="#059669" strokeWidth="1.5" fill="none" />
      <line x1="28" y1="50" x2="72" y2="50" stroke="#059669" strokeWidth="1.5" />
      
      {/* Center Golden/Emerald Star */}
      <polygon
        points="50,38 53,46 61,46 55,51 57,59 50,54 43,59 45,51 39,46 47,46"
        fill="#F59E0B"
        stroke="#D97706"
        strokeWidth="1"
      />
      
      {/* University Acronym HUNRE */}
      <rect x="30" y="70" width="40" height="13" rx="3" fill="#047857" />
      <text
        x="50"
        y="79"
        fill="#FFFFFF"
        fontSize="8"
        fontWeight="800"
        textAnchor="middle"
        letterSpacing="1"
        fontFamily="sans-serif"
      >
        HUNRE
      </text>
    </svg>
  );
};

export const HunreRedSealStamp: React.FC<SealProps> = ({
  size = 140,
  signedDate = '2026-10-04',
  signerName = 'TRẦN THỊ VÂN PHƯƠNG',
  isVerified = true,
  className = '',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative select-none pointer-events-none ${className}`}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform -rotate-6 transition-transform"
      >
        {/* Distressed Red Ink Outline */}
        <circle cx="100" cy="100" r="92" stroke="#DC2626" strokeWidth="4.5" fill="#FEF2F2" fillOpacity="0.85" />
        <circle cx="100" cy="100" r="84" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="4 3" />
        <circle cx="100" cy="100" r="54" stroke="#DC2626" strokeWidth="1.8" />

        {/* Curved Text Top: ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG HÀ NỘI */}
        <defs>
          <path id="topCurve" d="M 28 100 A 72 72 0 0 1 172 100" />
          <path id="bottomCurve" d="M 172 100 A 72 72 0 0 1 28 100" />
        </defs>

        <text fill="#DC2626" fontSize="10.5" fontWeight="800" letterSpacing="0.8">
          <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
            ★ ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG HÀ NỘI ★
          </textPath>
        </text>

        <text fill="#DC2626" fontSize="10" fontWeight="700" letterSpacing="1">
          <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
            CHỨNG THỰC CHỮ KÝ SỐ PKI
          </textPath>
        </text>

        {/* Center Star & Validation */}
        <polygon
          points="100,68 103,76 112,76 105,82 107,90 100,85 93,90 95,82 88,76 97,76"
          fill="#DC2626"
        />

        {/* Center Badge: ĐÃ KÝ SỐ */}
        <rect x="46" y="93" width="108" height="20" rx="3" fill="#DC2626" />
        <text
          x="100"
          y="107"
          fill="#FFFFFF"
          fontSize="11.5"
          fontWeight="900"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          {isVerified ? 'ĐÃ KÝ SỐ HỢP LỆ' : 'CHỮ KÝ KHÔNG HỢP LỆ'}
        </text>

        <text
          x="100"
          y="125"
          fill="#DC2626"
          fontSize="8"
          fontWeight="700"
          textAnchor="middle"
        >
          {signerName.substring(0, 24).toUpperCase()}
        </text>

        <text
          x="100"
          y="136"
          fill="#DC2626"
          fontSize="7"
          fontWeight="600"
          textAnchor="middle"
          className="font-mono"
        >
          NGÀY KÝ: {signedDate.substring(0, 10)}
        </text>
      </svg>
    </div>
  );
};
