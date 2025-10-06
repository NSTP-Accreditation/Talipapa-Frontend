import React from 'react';
import { Link } from 'react-router-dom';
import { Store, User } from 'lucide-react';

export default function NavBar() {
  return (
    <header className="bg-green-600 text-white py-4 px-6">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Store className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-xl tracking-wide">E-Talipapa</span>
            <span className="text-xs opacity-80">Barangay Talipapa CMS</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-green-200 px-3 py-2 rounded hover:bg-green-700">Home</Link>
          <Link to="/guidelines" className="hover:text-green-200 px-3 py-2 rounded hover:bg-green-700">Guides</Link>
          <a href="#" className="hover:text-green-200 px-3 py-2 rounded hover:bg-green-700">Services</a>
          <Link to="/trading" className="hover:text-green-200 px-3 py-2 rounded hover:bg-green-700">Trading</Link>
          <a href="#" className="hover:text-green-200 px-3 py-2 rounded hover:bg-green-700">About Us</a>
        </div>

        <div className="flex items-center space-x-3">
          <button className="bg-white text-green-600 hover:bg-gray-50 px-4 py-2 rounded">Sign Up</button>
          <button className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded">Sign In</button>
          <button className="bg-green-700 hover:bg-green-800 p-2 rounded-full ml-2">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
