# Universal Links Setup for Spawn

This document explains the Universal Links setup that allows users to open `https://getspawn.com/activity/{activityId}` links directly in the Spawn iOS app when installed.

## How It Works

When a user clicks a `https://getspawn.com/activity/{activityId}` link:
1. **If Spawn app is installed**: iOS automatically opens the link in the app, bypassing the web browser
2. **If Spawn app is NOT installed**: The link opens in the web browser normally

## Simplified URL Structure

The app now uses a simplified, consistent URL structure:
- **Universal Links**: `https://getspawn.com/activity/{activityId}`
- **Custom URL Schemes**: `spawn://activity/{activityId}`
- **Web Routes**: 
  - `/activity/{activityId}` - Activity invite page
  - `/activity/{activityId}/sign-in` - Guest sign-in flow
  - `/activity/{activityId}/onboarding` - Post-signup onboarding

## Files Changed

### iOS App Changes
1. **`Spawn-App-iOS-SwiftUI.entitlements`**: Added Associated Domains entitlement
2. **`DeepLinkManager.swift`**: Updated to handle both custom URL schemes and Universal Links
3. **`Spawn_App_iOS_SwiftUIApp.swift`**: Updated onOpenURL handler for Universal Links

### Web App Changes
1. **`public/.well-known/apple-app-site-association`**: Apple App Site Association file
2. **`vite.config.js`**: Added middleware to serve AASA file with correct content type

## Deployment Requirements

### AASA File Requirements
The Apple App Site Association file MUST be:
- Served at `https://getspawn.com/.well-known/apple-app-site-association`
- Served with `Content-Type: application/json`
- Accessible via HTTPS (no redirects)
- Available without authentication

### Vercel Deployment
For Vercel, add this to your `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/.well-known/apple-app-site-association",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/json"
        }
      ]
    }
  ]
}
```

### Netlify Deployment
For Netlify, add this to your `_headers` file:

```
/.well-known/apple-app-site-association
  Content-Type: application/json
```

## Testing Universal Links

### 1. Deploy both AASA file and iOS app
- Deploy web app with AASA file to production domain
- Install iOS app on device (via TestFlight or App Store)

### 2. Test AASA file accessibility
Visit: `https://getspawn.com/.well-known/apple-app-site-association`
- Should return JSON content
- Should have `Content-Type: application/json` header

### 3. Test Universal Links
1. **Safari test**: Type URL directly in Safari address bar → should open in app
2. **Messages test**: Send link via iMessage → tapping should open in app
3. **Notes test**: Add link in Notes app → tapping should open in app

**Note**: Universal Links may not work when:
- Clicking from Safari on the same domain
- Using localhost/development URLs
- AASA file is not properly configured

## App Store Requirements

Before submitting to App Store:
1. Ensure AASA file is deployed to production domain
2. Test Universal Links work with production URLs
3. Verify Associated Domains entitlement is correctly configured

## Troubleshooting

### Universal Links not working?
1. Check AASA file is accessible and has correct content type
2. Verify iOS app has correct Bundle ID and Team ID in entitlements
3. Test with a fresh install of the app
4. Use Apple's validation tool: https://search.developer.apple.com/appsearch-validation-tool/

### Still getting web page instead of app?
- Universal Links have a fallback mechanism - if iOS detects issues, it falls back to web
- Try with different apps (Messages, Notes) not Safari
- Clear Safari cache and try again 