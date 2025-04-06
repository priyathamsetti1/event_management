import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, PlusCircle } from 'lucide-react';

function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Event Management System</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <Link to="/events" 
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Calendar className="w-12 h-12 mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold mb-2">Browse Events</h2>
          <p className="text-gray-600">Discover upcoming events and register to attend</p>
        </Link>

        <Link to="/create-event"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <PlusCircle className="w-12 h-12 mb-4 text-green-600" />
          <h2 className="text-xl font-semibold mb-2">Create Event</h2>
          <p className="text-gray-600">Host your own event and manage registrations</p>
        </Link>

        <Link to="/manage-events"
          className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <Users className="w-12 h-12 mb-4 text-purple-600" />
          <h2 className="text-xl font-semibold mb-2">Manage Events</h2>
          <p className="text-gray-600">View and manage your created events</p>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;