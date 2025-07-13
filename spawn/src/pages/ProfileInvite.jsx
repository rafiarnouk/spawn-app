import { useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import { openAppStore, handleProfileInvite } from '@/lib/utils';
import PropTypes from 'prop-types';

// Import app promo assets
import appLogo from '@/assets/app_promo/app_logo.png';
import downloadButton from '@/assets/app_promo/download_button.png';
import firstAppImg from '@/assets/app_promo/first.png';
import secondAppImg from '@/assets/app_promo/second.png';
import thirdAppImg from '@/assets/app_promo/third.png';

function ProfileInvite() {
  const { profileId, shareCode } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use either profileId (UUID) or shareCode (share-code) from URL parameters
  const currentProfileId = profileId || shareCode;
  const isShareCode = !!shareCode;

  const fetchProfileData = useCallback(async () => {
    if (!currentProfileId) {
      setError('No profile ID provided');
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
        fetchUrl = `${apiBaseUrl}/api/v1/share/profile/${currentProfileId}`;
        console.log(`Fetching profile data via share code from: ${fetchUrl}`);
      } else {
        // Use legacy UUID endpoint
        fetchUrl = `${apiBaseUrl}/api/v1/users/${currentProfileId}?isProfileExternalInvite=true`;
        console.log(`Fetching profile data via UUID from: ${fetchUrl}`);
      }
      
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Received profile data:', data);
        
        // Set profile data directly (assuming the API returns a user object)
        setProfileData(data);
      } else if (response.status === 404) {
        console.error('Profile not found:', currentProfileId);
        const errorMessage = isShareCode 
          ? 'This profile link has expired or is no longer available'
          : 'Profile not found or no longer available';
        setError(errorMessage);
      } else if (response.status === 401) {
        console.error('Unauthorized access to profile:', currentProfileId);
        setError('This profile link may have expired or is not publicly accessible');
      } else {
        console.error('Failed to fetch profile:', response.status, response.statusText);
        setError(`Failed to load profile details (${response.status})`);
      }
    } catch (err) {
      console.error('Network error fetching profile:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Unable to connect to the server. Please check your internet connection or try again later.');
      } else {
        setError('Failed to load profile details');
      }
    } finally {
      setLoading(false);
    }
  }, [currentProfileId]);

  useEffect(() => {
    document.title = "Spawn - Check Out This Profile!";
    fetchProfileData();
  }, [fetchProfileData]);

  const handleConnectOnSpawn = async () => {
    // Use the new utility function to handle app installation detection
    await handleProfileInvite(currentProfileId, () => {
      // For profile links, we want to open the app directly if installed
      // or redirect to the App Store if not installed
      openAppStore();
    });
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Function to render user avatar with profile picture fallback
  const UserAvatar = ({ user, size = 'w-20 h-20', className = '' }) => {
    const displayName = user?.name || user?.username || 'User';
    const profilePicture = user?.profilePicture;
    
    return (
      <div className={`${size} rounded-full border-4 border-white flex items-center justify-center overflow-hidden ${className}`}>
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
          className={`w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-lg font-medium text-white ${profilePicture ? 'hidden' : 'flex'}`}
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spawn-purple"></div>
    </div>
  );

  const ErrorContent = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-spawn-purple hover:bg-spawn-purple/90 text-white rounded-full px-8 py-3"
        >
          Try Again
        </Button>
      </div>
    </div>
  );

  const ProfileContent = () => {
    if (!profileData) return <LoadingContent />;

    const displayName = profileData.name || profileData.username || 'User';
    const username = profileData.username || 'username';

    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-spawn-purple to-purple-600 px-6 py-8 text-center">
          <div className="text-white text-2xl font-bold mb-2">
            spawn
            <span className="text-yellow-300 ml-1">⭐</span>
          </div>
          <p className="text-purple-100 text-sm">Connect with friends spontaneously</p>
        </div>

        {/* Profile Info */}
        <div className="px-6 py-8 text-center">
          <div className="mb-6">
            <UserAvatar user={profileData} size="w-24 h-24" className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{displayName}</h2>
            <p className="text-gray-500">@{username}</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-700 text-lg mb-2">
              Connect with {displayName} on Spawn!
            </p>
            <p className="text-gray-500 text-sm">
              Download the app to connect with friends and discover spontaneous activities together.
            </p>
          </div>

          <Button 
            onClick={handleConnectOnSpawn}
            className="w-full bg-spawn-purple hover:bg-spawn-purple/90 text-white rounded-full py-6 mb-6"
          >
            Connect on Spawn
          </Button>

          <div className="text-xs text-gray-400">
            <p>
              Don't have the app yet?{" "}
              <button 
                onClick={openAppStore}
                className="text-spawn-purple font-medium underline"
              >
                Download here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // App promotion section for desktop
  const AppPromoSection = () => (
    <div className="hidden md:block max-w-4xl mx-auto mt-16 px-4">
      <div className="text-center mb-12">
        <img src={appLogo} alt="Spawn App" className="mx-auto mb-6" style={{ width: '120px', height: '120px' }} />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Get the Spawn App</h2>
        <p className="text-lg text-gray-600 mb-8">
          Connect with friends and discover spontaneous activities in your area
        </p>
        <button onClick={openAppStore} className="inline-block">
          <img src={downloadButton} alt="Download on App Store" className="h-14" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <img src={firstAppImg} alt="Connect with friends" className="mx-auto mb-4 rounded-lg shadow-md" style={{ width: '200px', height: '400px' }} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect with Friends</h3>
          <p className="text-gray-600">Build your network and stay connected with people who matter</p>
        </div>
        
        <div className="text-center">
          <img src={secondAppImg} alt="Discover activities" className="mx-auto mb-4 rounded-lg shadow-md" style={{ width: '200px', height: '400px' }} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Activities</h3>
          <p className="text-gray-600">Find exciting activities and events happening around you</p>
        </div>
        
        <div className="text-center">
          <img src={thirdAppImg} alt="Spontaneous meetups" className="mx-auto mb-4 rounded-lg shadow-md" style={{ width: '200px', height: '400px' }} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Spontaneous Meetups</h3>
          <p className="text-gray-600">Join last-minute plans and make memories with friends</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={bgGradient} className="min-h-screen py-8 px-4">
      {loading && <LoadingContent />}
      {error && <ErrorContent />}
      {!loading && !error && (
        <>
          {/* Mobile View */}
          <div className="md:hidden">
            <ProfileContent />
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <BrowserFrame>
              <div className="bg-white">
                <ProfileContent />
              </div>
            </BrowserFrame>
            <AppPromoSection />
          </div>
        </>
      )}
    </div>
  );
}

export default ProfileInvite; 