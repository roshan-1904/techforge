import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://www.techforge.in/images/logo-light.png" 
                alt="TechForge Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-bold text-sm sm:text-base">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 font-bold text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden xs:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-bold text-sm sm:text-base">
                Admin Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;