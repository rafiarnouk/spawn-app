# Spawn App

A social app for spontaneous meetups and activities.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the local auth server (for admin functionality):
```bash
node server.js
```

3. In a new terminal, start the development server:
```bash
npm run dev
```

## Activity Invite Links - Backend Configuration Issue

**Current Status**: The invite link functionality is now connected to the production backend (`https://spawn-app-back-end-production.up.railway.app`), but there's an authentication issue.

### Issue
The production backend returns `401 Unauthorized` for all requests, including invite endpoints that should be publicly accessible:
- `GET /api/v1/activities/:id?isActivityExternalInvite=true` 
- `POST /api/v1/activities/:id/join`

### Expected Behavior
These endpoints should allow public access for external invite links to work without requiring users to authenticate first.

### Frontend Implementation
The frontend is properly configured to:
1. Fetch activity data from invite links
2. Allow guest users to join activities
3. Show appropriate error messages when backend is unavailable

### Testing
To test the invite UI (will show error due to backend auth):
- http://localhost:5173/invite/any-activity-id
- http://localhost:5173/activity/any-activity-id

### Next Steps
The backend needs to be configured to allow public access to external invite endpoints, or provide a different authentication mechanism for invite links.
