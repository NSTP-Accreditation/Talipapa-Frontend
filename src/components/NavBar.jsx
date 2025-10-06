import React from 'react';
import { Link } from 'react-router-dom';
import { HopOff, User } from 'lucide-react';

export default function NavBar() {
  return (
    <header style={{backgroundColor: '#1b4c2e'}} className="text-white py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HopOff className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-xl tracking-wide">E-Talipapa</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-200 px-3 py-2 rounded hover:opacity-80">Home</Link>
          <Link to="/guidelines" className="hover:text-green-200 px-3 py-2 rounded hover:opacity-80">Guides</Link>
          <a href="#" className="hover:text-green-200 px-3 py-2 rounded hover:opacity-80">Services</a>
          <Link to="/trading" className="hover:text-green-200 px-3 py-2 rounded hover:opacity-80">Trading</Link>
          <a href="#" className="hover:text-green-200 px-3 py-2 rounded hover:opacity-80">About Us</a>
        </div>

        <div className="flex items-center space-x-3">
          <button style={{backgroundColor: '#143722'}} className="hover:opacity-90 p-2 rounded-full ml-2">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
