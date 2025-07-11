import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Detect if the user is on an Apple device (iOS, iPadOS, or macOS)
 */
export const isAppleDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';
  
  // Check for iOS devices
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || 
               (platform.includes('mac') && 'ontouchend' in document);
  
  // Check for macOS (but not iOS)
  const isMacOS = platform.includes('mac') && !isIOS;
  
  return isIOS || isMacOS;
};

/**
 * Check if the Spawn app is installed by attempting to open a custom URL scheme
 * @param {string} activityId - The activity ID to deep link to
 * @returns {Promise<boolean>} - Returns true if app is installed, false otherwise
 */
export const checkSpawnAppInstalled = (activityId) => {
  return new Promise((resolve) => {
    if (!isAppleDevice()) {
      resolve(false);
      return;
    }

    // Create the deep link URL
    const deepLinkUrl = `spawn://activity/${activityId}`;
    
    // Set up a timeout to check if the app opened
    const checkTimeout = setTimeout(() => {
      // If we're still here after the timeout, the app probably isn't installed
      resolve(false);
    }, 2000);
    
    // Listen for page visibility changes (indicates app might have opened)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(checkTimeout);
        resolve(true);
      }
    };
    
    // Listen for blur events (indicates app might have opened)
    const handleBlur = () => {
      clearTimeout(checkTimeout);
      resolve(true);
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    
    // Clean up event listeners after timeout
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    }, 2500);
    
    // Try to open the app
    try {
      window.location.href = deepLinkUrl;
    } catch {
      clearTimeout(checkTimeout);
      resolve(false);
    }
  });
};

/**
 * Open the App Store for the Spawn app (or placeholder app)
 */
export const openAppStore = () => {
  // Using the placeholder app store link as requested
  const appStoreUrl = 'https://apps.apple.com/nz/app/quote-droplet-daily-quotes/id6455084603';
  
  if (isAppleDevice()) {
    // On Apple devices, try to open the App Store directly
    window.location.href = appStoreUrl;
  } else {
    // On other devices, open in a new tab
    window.open(appStoreUrl, '_blank');
  }
};

/**
 * Handle activity invite click with app installation detection
 * @param {string} activityId - The activity ID
 * @param {Function} navigateCallback - Navigation callback for web fallback
 */
export const handleActivityInvite = async (activityId, navigateCallback) => {
  if (!isAppleDevice()) {
    // Not an Apple device, proceed with normal web flow
    navigateCallback();
    return;
  }

  // On Apple devices, check if app is installed
  const isAppInstalled = await checkSpawnAppInstalled(activityId);
  
  if (!isAppInstalled) {
    // App not installed, open App Store
    openAppStore();
  } else {
    // App is installed, it should have opened via the deep link
    // If for some reason it didn't open, fall back to web
    setTimeout(() => {
      navigateCallback();
    }, 1000);
  }
};
