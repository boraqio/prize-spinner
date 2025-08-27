// Firestore initialization and setup utility
import { db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Firestore database with proper setup
export const initializeFirestore = async () => {
  try {
    // Test write operation to ensure Firestore is working
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, {
      message: 'Firestore connection test',
      timestamp: new Date(),
      initialized: true,
      version: '1.0.0'
    });

    // Test read operation
    const docSnap = await getDoc(testDoc);
    if (docSnap.exists()) {
      return {
        success: true,
        message: 'Firestore initialized successfully'
      };
    }

    return {
      success: false,
      error: 'Could not verify Firestore connection'
    };

  } catch (error) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      userMessage: error.code === 'permission-denied'
        ? 'Database access denied. Please check Firebase security rules.'
        : 'Failed to connect to database. Please try again.'
    };
  }
};

export default initializeFirestore;
