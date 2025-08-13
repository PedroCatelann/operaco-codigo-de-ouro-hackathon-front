import React from 'react';
import logo from '../assets/Logo.svg';
import ThemeToggle from './ThemeToggle';
import './Header.css';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="header-container">
      {/* Logo and user info */}
      <div className="header-top">
        <div className="logo-section">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div className="user-section">
          <ThemeToggle />
          <div className="user-avatar"></div>
          <span className="user-name"></span>
          <button className="user-menu-btn">▾</button>
        </div>
      </div>
      

    </header>
  );
};

export default Header; 