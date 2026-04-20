import React from 'react';
import { Heart } from 'lucide-react';

const Header = ({ availableCount }) => {
  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="header-logo">
          <Heart fill="currentColor" size={28} />
          <span>Community Blood Donor Finder</span>
        </a>
        <div className="stats-badge">
          {availableCount} Available Donors
        </div>
      </div>
    </header>
  );
};

export default Header;
