import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';

function EventInvite() {
  const { inviteId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Spawn - You've Been Invited!";
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

  const handleSpawnIn = () => {
    // Redirect to guest sign-in page with the inviteId
    navigate(`/invite/${inviteId}/sign-in`);
  };

  // Gradient background style
  const bgGradient = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
    minHeight: '100vh',
  };
  
  // Mock browser UI for desktop view
  const BrowserFrame = ({ children }) => (
    <div className="hidden md:block max-w-md mx-auto rounded-t-lg border border-gray-200 shadow-md bg-gray-100">
      <div className="flex items-center p-2 border-b border-gray-200">
        <div className="flex space-x-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-full bg-white text-xs text-gray-500 flex items-center">
            <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M15 12H12V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
        <div className="w-8"></div>
      </div>
      {children}
    </div>
  );

  const InviteContent = () => (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden mx-auto">
      {/* Logo section */}
      <div className="p-6 pb-2 text-center">
        <div className="text-spawn-purple text-3xl font-bold relative">
          spawn
          <span className="absolute text-spawn-purple text-2xl" style={{ right: "-12px", top: "-5px" }}>⭐</span>
        </div>
      </div>
      
      {/* Invitation header */}
      <div className="px-6 pt-2 pb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">You've Been Invited!</h1>
        <p className="text-lg text-spawn-purple font-medium mb-4">
          {eventData.inviter} wants you to spawn in.
        </p>
      </div>
      
      {/* Event card */}
      <div className="px-6 pb-6">
        <div className="bg-spawn-purple/80 text-white rounded-2xl p-4">
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
        </div>
      </div>
      
      {/* Action button */}
      <div className="px-6 pb-8 text-center">
        <Button 
          className="w-full bg-spawn-purple hover:bg-spawn-purple/90 rounded-full py-6 text-white text-lg font-medium"
          onClick={handleSpawnIn}
        >
          Spawn In!
        </Button>
        
        <p className="text-sm text-gray-600 mt-4">
          Let them know you're coming — spawn in to continue.
        </p>
      </div>
    </div>
  );

  return (
    <div style={bgGradient} className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Mobile view */}
      <div className="block md:hidden w-full">
        <InviteContent />
      </div>
      
      {/* Desktop view with browser frame */}
      <div className="hidden md:block w-full">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Spawn Event Invitation</h1>
          <BrowserFrame>
            <InviteContent />
          </BrowserFrame>
        </div>
      </div>
    </div>
  );
}

export default EventInvite; 