import React from 'react';
import { REVIVA_LOGO_BASE64 } from '../constants';

const Logo: React.FC = () => (
  <div className="flex justify-center p-4">
    <img src={REVIVA_LOGO_BASE64} alt="Escola Reviva Logo" className="w-48 h-auto" />
  </div>
);

export default Logo;