import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from 'react-router-dom';
import { mapBackendToActivityInvite, isValidActivityInvite } from '@/types/ActivityInviteTypes';
import { handleActivityInvite, openAppStore } from '@/lib/utils';
import PropTypes from 'prop-types';

// Import app promo assets
import appLogo from '@/assets/app_promo/app_logo.png';
import downloadButton from '@/assets/app_promo/download_button.png';
import firstAppImg from '@/assets/app_promo/first.png';
import secondAppImg from '@/assets/app_promo/second.png';
import thirdAppImg from '@/assets/app_promo/third.png';

function ActivityInvite() {
  const { activityId, shareCode } = useParams();
  const navigate = useNavigate();
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use either activityId (UUID) or shareCode (share-code) from URL parameters
  const currentActivityId = activityId || shareCode;
  const isShareCode = !!shareCode;

  const fetchActivityData = useCallback(async () => {
    if (!currentActivityId) {
      setError('No activity ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use production backend URL
      const apiBaseUrl = 'https://spawn-app-back-end-production.up.railway.app';
      
      let fetchUrl;
      if (isShareCode) {
        // Use share code endpoint
        fetchUrl = `${apiBaseUrl}/api/v1/share/activity/${currentActivityId}`;
        console.log(`Fetching activity data via share code from: ${fetchUrl}`);
      } else {
        // Use legacy UUID endpoint
        fetchUrl = `${apiBaseUrl}/api/v1/activities/${currentActivityId}?isActivityExternalInvite=true`;
        console.log(`Fetching activity data via UUID from: ${fetchUrl}`);
      }
      
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received activity data:', data);
        
        // Validate and map the data
        if (isValidActivityInvite(data)) {
          const mappedData = mapBackendToActivityInvite(data);
          setActivityData(mappedData);
        } else {
          console.error('Invalid activity data structure:', data);
          setError('Invalid activity data received');
        }
      } else if (response.status === 404) {
        console.error('Activity not found:', currentActivityId);
        const errorMessage = isShareCode 
          ? 'This activity link has expired or is no longer available'
          : 'Activity not found or no longer available';
        setError(errorMessage);
      } else if (response.status === 401) {
        console.error('Unauthorized access to activity:', currentActivityId);
        setError('This invite link may have expired or is not publicly accessible');
      } else {
        console.error('Failed to fetch activity:', response.status, response.statusText);
        setError(`Failed to load activity details (${response.status})`);
      }
    } catch (err) {
      console.error('Network error fetching activity:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        setError('Failed to load activity details');
      }
    } finally {
      setLoading(false);
    }
  }, [currentActivityId]);

  useEffect(() => {
    document.title = "Spawn - You've Been Invited!";
    fetchActivityData();
  }, [fetchActivityData]);

  const handleSpawnIn = async () => {
    // Use the new utility function to handle app installation detection
    await handleActivityInvite(currentActivityId, () => {
      // Navigate to guest sign-in page with the activity ID or share code
      // Universal Links will automatically open the app if installed
      const signInPath = isShareCode 
        ? `/a/${currentActivityId}/sign-in`
        : `/activity/${currentActivityId}/sign-in`;
      navigate(signInPath);
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Time TBD';
    
    try {
      const date = new Date(dateTimeString);
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      const timeStr = date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      return `${dateStr} at ${timeStr}`;
    } catch {
      return dateTimeString;
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Function to render user avatar with profile picture fallback
  const UserAvatar = ({ user, creatorName, size = 'w-8 h-8', className = '' }) => {
    const displayName = user?.name || user?.username || creatorName;
    const profilePicture = user?.profilePicture;
    
    return (
      <div className={`${size} rounded-full border-2 border-white flex items-center justify-center overflow-hidden ${className}`}>
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-xs font-medium text-white ${profilePicture ? 'hidden' : 'flex'}`}
          style={{ display: profilePicture ? 'none' : 'flex' }}
        >
          {getInitials(displayName)}
        </div>
      </div>
    );
  };

  UserAvatar.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      username: PropTypes.string,
      profilePicture: PropTypes.string
    }),
    creatorName: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string
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
            getspawn.com
          </div>
        </div>
        <div className="w-8"></div>
      </div>
      {children}
    </div>
  );

  BrowserFrame.propTypes = {
    children: PropTypes.node.isRequired
  };

  const LoadingContent = () => (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden mx-auto">
      <div className="p-6 text-center">
        <div className="text-spawn-purple text-3xl font-bold relative mb-8">
          spawn
          <span className="absolute text-spawn-purple text-2xl" style={{ right: "-12px", top: "-5px" }}>⭐</span>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  const ErrorContent = () => (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-lg overflow-hidden mx-auto">
      <div className="p-6 text-center">
        <div className="text-spawn-purple text-3xl font-bold relative mb-8">
          spawn
          <span className="absolute text-spawn-purple text-2xl" style={{ right: "-12px", top: "-5px" }}>⭐</span>
        </div>
        <div className="text-red-600 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Activity</h2>
          <p className="text-gray-600">{error}</p>
        </div>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-spawn-purple hover:bg-spawn-purple/90 rounded-full py-2 px-6"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const InviteContent = () => {
    if (loading) return <LoadingContent />;
    if (error || !activityData) return <ErrorContent />;

    const creatorName = activityData.creatorName || 'Someone';
    const creatorUsername = activityData.creatorUsername || '@user';
    
    return (
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You&apos;ve Been Invited!</h1>
          <p className="text-lg text-spawn-purple font-medium mb-4">
            {creatorUsername} wants you to spawn in.
          </p>
        </div>
        
        {/* Activity card */}
        <div className="px-6 pb-6">
          <div className="bg-spawn-purple/80 text-white rounded-2xl p-4">
            {/* Activity header with icon */}
            <div className="mb-4">
              <div className="flex items-center mb-2">
                {activityData.icon && (
                  <span className="text-2xl mr-2">{activityData.icon}</span>
                )}
                <h2 className="text-2xl font-bold flex-1">{activityData.title || 'Untitled Activity'}</h2>
              </div>
              <p className="text-sm opacity-90">{formatDateTime(activityData.startTime)}</p>
              {activityData.endTime && activityData.endTime !== activityData.startTime && (
                <p className="text-xs opacity-75">Ends: {formatDateTime(activityData.endTime)}</p>
              )}
            </div>
            
            {/* Location */}
            {activityData.location && (
              <div className="flex items-center bg-spawn-purple/60 rounded-full px-3 py-1 mb-4 w-fit">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="white"/>
                  <path d="M12 2C7.58172 2 4 5.58172 4 10C4 11.8487 4.63901 13.551 5.73046 14.9324L12 22L18.2695 14.9324C19.361 13.551 20 11.8487 20 10C20 5.58172 16.4183 2 12 2Z" stroke="white" strokeWidth="2"/>
                </svg>
                <span className="text-sm">{activityData.location}</span>
              </div>
            )}
            
            {/* Attendees section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-90">
                  {activityData.totalAttendees === 1 ? '1 person' : `${activityData.totalAttendees} people`} spawning in
                </span>
              </div>
              
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {/* Creator avatar - always show first */}
                  <UserAvatar 
                    user={{ name: creatorName, profilePicture: null }} 
                    creatorName={creatorName}
                    className="bg-gradient-to-br from-orange-400 to-orange-500"
                  />
                  
                  {/* Show attendees (excluding creator) */}
                  {activityData.attendees && activityData.attendees.slice(0, 4).map((attendee, index) => (
                    <UserAvatar 
                      key={attendee.id || index}
                      user={attendee}
                      className="bg-gradient-to-br from-purple-400 to-purple-600"
                    />
                  ))}
                </div>
                
                {/* Show remaining count */}
                {activityData.totalAttendees > 5 && (
                  <div className="ml-2 bg-white/20 rounded-full px-2 py-0.5 text-xs font-medium">
                    +{activityData.totalAttendees - 5}
                  </div>
                )}
              </div>
            </div>
            
            {/* Host section */}
            <div className="border-t border-white/20 pt-3 mt-3">
              <div className="flex items-center mb-2">
                <UserAvatar 
                  user={{ name: creatorName, profilePicture: null }}
                  creatorName={creatorName}
                  size="w-8 h-8"
                  className="bg-gradient-to-br from-orange-400 to-orange-500 mr-2"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Hosted by {creatorName}</div>
                  <div className="text-xs opacity-75">{creatorUsername}</div>
                </div>
              </div>
              
              {/* Description */}
              {activityData.description && (
                <div className="mt-2">
                  <p className="text-sm opacity-90 leading-relaxed">
                    {activityData.description}
                  </p>
                </div>
              )}
              
              {/* Activity category */}
              {activityData.category && (
                <div className="mt-2">
                  <span className="inline-block bg-white/20 rounded-full px-2 py-1 text-xs capitalize">
                    {activityData.category.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
              )}
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
          
          <p className="text-sm text-gray-600 mt-4 mb-8">
            Let them know you&apos;re coming — spawn in to continue.
          </p>
          
          {/* Get the full experience section */}
          <div className="w-full bg-gray-100 rounded-xl p-4 flex items-center mb-4">
            <img src={appLogo} alt="Spawn App" className="w-12 h-12 mr-3" />
            <div className="flex-1">
              <h3 className="font-medium text-sm">Get the full experience</h3>
              <p className="text-xs text-gray-600">More features, better coordination, and the full crew in one place.</p>
            </div>
          </div>
          
          {/* App Store download button */}
          <button onClick={openAppStore} className="inline-block">
            <img src={downloadButton} alt="Download on the App Store" className="h-10" />
          </button>
          
          {/* App screenshots preview */}
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
  };

  return (
    <div style={bgGradient} className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* Mobile view */}
      <div className="block md:hidden w-full">
        <InviteContent />
      </div>
      
      {/* Desktop view with browser frame */}
      <div className="hidden md:block w-full">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Spawn Activity Invitation</h1>
          <BrowserFrame>
            <InviteContent />
          </BrowserFrame>
        </div>
      </div>
    </div>
  );
}

export default ActivityInvite; 