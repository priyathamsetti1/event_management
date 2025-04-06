import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">EventManager</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/events" className={`${isActive('/events')} transition-colors`}>
              Events
            </Link>
            <Link to="/create-event" className={`${isActive('/create-event')} transition-colors`}>
              Create Event
            </Link>
            <Link to="/manage-events" className={`${isActive('/manage-events')} transition-colors`}>
              Manage Events
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;