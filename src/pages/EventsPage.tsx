import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="flex items-center text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{format(new Date(event.date), 'PPP')}</span>
              </div>
              
              <div className="flex items-center text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{event.location}</span>
              </div>
              
              <button 
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
                onClick={() => {/* Handle registration */}}
              >
                Register Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventsPage;