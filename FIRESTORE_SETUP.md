# 🔥 Firestore Security Rules Setup

## Problem
Your Firestore database is currently blocking all access due to default security rules. You're seeing the error:
```
❌ Firestore initialization failed: FirebaseError: Missing or insufficient permissions.
```

## Solution
You need to update your Firestore security rules to allow your application to read and write data.

## Steps to Fix

### 1. Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **boraqspin**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab

### 2. Update Security Rules
Replace the existing rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to spinResults collection for authenticated users
    match /spinResults/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Allow read/write access to test collection (for initialization)
    match /test/{document} {
      allow read, write: if true; // Open for testing
    }
    
    // Allow read/write access to users collection for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // For development: temporary open access (REMOVE IN PRODUCTION)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Publish the Rules
1. Click **Publish** button
2. Wait for the rules to deploy (usually takes a few seconds)

### 4. Test the Connection
1. Refresh your application
2. You should see: `✅ Firestore is ready` in the console
3. The permission error should be gone

## Production Security Rules
⚠️ **Important**: The rules above include open access for development. For production, use these more secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Spin results - only authenticated users can read/write their own data
    match /spinResults/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email_verified == true;
    }
    
    // User profiles - users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Test collection - remove in production
    match /test/{document} {
      allow read, write: if false;
    }
  }
}
```

## Troubleshooting

### If you still get permission errors:
1. Make sure you're signed in with Google Auth
2. Check that the rules are published (not just saved)
3. Try refreshing the page
4. Check the browser console for any other errors

### If you can't access Firebase Console:
1. Make sure you're logged in with the correct Google account
2. Verify you have owner/editor permissions on the Firebase project
3. Contact the project owner if you don't have access

## Verification
After updating the rules, you should see these messages in your browser console:
- `✅ Firestore write test successful`
- `✅ Firestore read test successful`
- `✅ Firestore is ready`
