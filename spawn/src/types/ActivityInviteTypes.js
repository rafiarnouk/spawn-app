/**
 * JavaScript types that correspond to the ActivityInviteDTO from the backend
 */

/**
 * Base user information for activity attendees
 * @typedef {Object} BaseUser
 * @property {string} id - User ID (UUID)
 * @property {string} name - User's full name
 * @property {string} email - User's email
 * @property {string} username - User's username
 * @property {string} bio - User's bio
 * @property {string} profilePicture - URL to user's profile picture
 */

/**
 * Activity invite data structure
 * @typedef {Object} ActivityInvite
 * @property {string} id - Activity ID (UUID)
 * @property {string} title - Activity title
 * @property {string} startTime - ISO datetime string for activity start (from AbstractActivityDTO.startTime)
 * @property {string} endTime - ISO datetime string for activity end (optional)
 * @property {string} note - Activity description/note
 * @property {string} icon - Activity icon (emoji)
 * @property {string} category - Activity category enum
 * @property {string} createdAt - ISO datetime string for when activity was created
 * @property {string} location - Location name
 * @property {string} creatorName - Creator's full name
 * @property {string} creatorUsername - Creator's username (with @ prefix)
 * @property {string} description - Activity description (same as note, for clarity)
 * @property {BaseUser[]} attendees - List of attendees (BaseUserDTO objects)
 * @property {number} totalAttendees - Total number of attendees including creator
 */

/**
 * Create a default/empty ActivityInvite object
 * @returns {ActivityInvite}
 */
export const createEmptyActivityInvite = () => ({
  id: '',
  title: '',
  startTime: '',
  endTime: '',
  note: '',
  icon: '',
  category: '',
  createdAt: '',
  location: '',
  creatorName: '',
  creatorUsername: '',
  description: '',
  attendees: [],
  totalAttendees: 0
});

/**
 * Validate if an object matches the ActivityInvite structure
 * @param {any} obj - Object to validate
 * @returns {boolean}
 */
export const isValidActivityInvite = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  
  // Check required fields exist and are of correct type
  const requiredFields = ['id', 'title', 'creatorName', 'creatorUsername'];
  const hasRequiredFields = requiredFields.every(field => 
    obj.hasOwnProperty(field) && typeof obj[field] === 'string'
  );
  
  // Validate attendees array if present
  const hasValidAttendees = !obj.attendees || 
    (Array.isArray(obj.attendees) && obj.attendees.every(attendee => 
      attendee && typeof attendee === 'object' && 
      typeof attendee.id === 'string'
    ));
  
  // Validate totalAttendees if present
  const hasValidTotal = !obj.totalAttendees || typeof obj.totalAttendees === 'number';
  
  return hasRequiredFields && hasValidAttendees && hasValidTotal;
};

/**
 * Map backend ActivityInviteDTO to frontend ActivityInvite object
 * @param {Object} backendData - Data from backend API
 * @returns {ActivityInvite}
 */
export const mapBackendToActivityInvite = (backendData) => ({
  id: backendData.id || '',
  title: backendData.title || '',
  startTime: backendData.startTime || '', // AbstractActivityDTO uses startTime field
  endTime: backendData.endTime || '',
  note: backendData.note || '',
  icon: backendData.icon || '',
  category: backendData.category || '',
  createdAt: backendData.createdAt || '',
  location: backendData.location || '',
  creatorName: backendData.creatorName || '',
  creatorUsername: backendData.creatorUsername || '',
  description: backendData.description || backendData.note || '',
  attendees: backendData.attendees ? backendData.attendees.map(attendee => ({
    id: attendee.id || '',
    name: attendee.name || '',
    email: attendee.email || '',
    username: attendee.username || '',
    bio: attendee.bio || '',
    profilePicture: attendee.profilePicture || null
  })) : [],
  totalAttendees: backendData.totalAttendees || 0
}); 