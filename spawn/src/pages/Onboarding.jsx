import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';

// Import app promo assets
import appLogo from '@/assets/app_promo/app_logo.png';
import downloadButton from '@/assets/app_promo/download_button.png';
import firstAppImg from '@/assets/app_promo/first.png';
import secondAppImg from '@/assets/app_promo/second.png';
import thirdAppImg from '@/assets/app_promo/third.png';

function Onboarding() {
  const { inviteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Spawn - You're In!";
  }, []);

  // In a real app, you would fetch event details using the inviteId
  const eventData = {
    inviter: "@haley_wong",
    eventTitle: "Dinner @ Chipotle",
    eventTime: "6 - 7:30pm",
    eventLocation: "7386 Name Street",
    eventDescription: "Come grab some dinner with us at Chipotle! Might go study at the library afterwards.",
    attendees: 2, // Plus host
    additionalAttendees: 20
  };

  // Gradient background style
  const bgGradient = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
    minHeight: '100vh',
  };

  return (
    <div style={bgGradient} className="flex flex-col min-h-screen">
      {/* Header with back button and logo */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button 
          className="text-gray-700"
          onClick={() => navigate(`/invite/${inviteId}`)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-spawn-purple text-2xl font-bold relative">
          spawn
          <span className="absolute text-spawn-purple text-xl" style={{ right: "-10px", top: "-4px" }}>⭐</span>
        </div>
        <div className="w-6"></div> {/* Empty div for spacing */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 pb-8">
        {/* "You're In!" header */}
        <h1 className="text-4xl font-bold mb-6 mt-4">You're In!</h1>
        
        {/* Event card */}
        <div className="w-full bg-spawn-purple/80 text-white rounded-2xl p-4 mb-6">
          <div className="mb-1">
            <h2 className="text-2xl font-bold">{eventData.eventTitle}</h2>
            <p className="text-sm">{eventData.eventTime}</p>
          </div>
          
          {/* Location */}
          <div className="flex items-center bg-spawn-purple/60 rounded-full px-3 py-1 mb-4 w-fit">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="white"/>
              <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8487 4.63901 13.551 5.73046 14.9324L12 22L18.2695 14.9324C19.361 13.551 20 11.8487 20 10C20 5.58172 16.4183 2 12 2Z" stroke="white" strokeWidth="2"/>
            </svg>
            <span className="text-sm">{eventData.eventLocation}</span>
          </div>
          
          {/* Attendees */}
          <div className="flex items-center mb-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-white flex items-center justify-center text-xs">
                HW
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white flex items-center justify-center text-xs">
                AS
              </div>
            </div>
            <div className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs">
              +{eventData.additionalAttendees}
            </div>
          </div>
          
          {/* Host and description */}
          <div className="mt-2">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-xs mr-2">
                HW
              </div>
              <div>{eventData.inviter}</div>
            </div>
            <p className="text-sm">
              {eventData.eventDescription}
            </p>
          </div>
          
          {/* Going button - moved inside the event card */}
          <div className="mt-4">
            <Button 
              className="w-full bg-white hover:bg-gray-100 text-gray-800 rounded-full py-6"
              disabled
            >
              Going
            </Button>
          </div>
        </div>
        
        {/* Get the full experience section */}
        <div className="w-full bg-white rounded-xl p-4 flex items-center mb-4">
          <img src={appLogo} alt="Spawn App" className="w-12 h-12 mr-3" />
          <div className="flex-1">
            <h3 className="font-medium text-sm">Get the full experience</h3>
            <p className="text-xs text-gray-600">More features, better coordination, and the full crew in one place.</p>
          </div>
        </div>
        
        {/* App Store download button */}
        <a href="https://getspawn.com" target="_blank" rel="noopener noreferrer">
          <img src={downloadButton} alt="Download on the App Store" className="h-10" />
        </a>
        
        {/* App screenshots preview - updated to show actual images */}
        <div className="w-full flex justify-center mt-6 mb-4 space-x-2 relative">
          <div className="relative w-24 h-48 overflow-hidden rounded-xl shadow-md">
            <img src={firstAppImg} alt="Spawn App Screenshot" className="w-full h-full object-cover" />
          </div>
          <div className="relative w-24 h-48 overflow-hidden rounded-xl shadow-md">
            <img src={secondAppImg} alt="Spawn App Screenshot" className="w-full h-full object-cover" />
          </div>
          <div className="relative w-24 h-48 overflow-hidden rounded-xl shadow-md">
            <img src={thirdAppImg} alt="Spawn App Screenshot" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Onboarding; 