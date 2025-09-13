
import React from 'react';

const Logo: React.FC = () => (
  <div className="flex flex-col items-center p-4">
    <svg width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_101_2)">
        <circle cx="60" cy="60" r="58" stroke="#FFFFFF" strokeWidth="4"/>
        <path d="M60 95C68.2843 95 75 88.2843 75 80H45C45 88.2843 51.7157 95 60 95Z" fill="#FFFFFF"/>
        <path d="M60 80V30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 50C75 50 75 30 60 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 50C45 50 45 30 60 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 65C70 65 70 50 60 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
        <path d="M60 65C50 65 50 50 60 50" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round"/>
        
        <circle cx="80" cy="40" r="5" fill="#FFFFFF"/>
        <circle cx="85" cy="55" r="5" fill="#FFFFFF"/>
        <circle cx="75" cy="68" r="5" fill="#FFFFFF"/>
        <circle cx="40" cy="40" r="5" fill="#FFFFFF"/>
        <circle cx="35" cy="55" r="5" fill="#FFFFFF"/>
        <circle cx="45" cy="68" r="5" fill="#FFFFFF"/>
        <circle cx="60" cy="25" r="5" fill="#FFFFFF"/>

        <path d="M30 100C30 92.5 40 90 60 90C80 90 90 92.5 90 100" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
        <path d="M35 105C35 97.5 45 95 60 95C75 95 85 97.5 85 105" stroke="#FFFFFF" strokeWidth="4" fill="none"/>
      </g>
      <defs>
        <clipPath id="clip0_101_2">
          <rect width="120" height="120" fill="white"/>
        </clipPath>
      </defs>
    </svg>
    <h1 className="text-white text-2xl font-bold mt-2 text-center">Escola Reviva</h1>
    <p className="text-white text-xs mt-1 italic text-center">"Restaurar Vidas e Valores"</p>
  </div>
);

export default Logo;
