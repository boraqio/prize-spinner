// Firebase database service for storing spin results
import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

const SPIN_RESULTS_COLLECTION = 'spinResults';

// Check if an email has already been used for spinning
export const checkEmailExists = async (email) => {
  try {
    // First check localStorage for immediate response
    const localData = JSON.parse(localStorage.getItem('boraqSpinResults') || '[]');
    const localEmailExists = localData.some(entry =>
      entry.email && entry.email.toLowerCase() === email.toLowerCase()
    );

    if (localEmailExists) {
      return { exists: true, count: 1, source: 'localStorage' };
    }

    // Try Firestore query
    const emailQuery = query(
      collection(db, SPIN_RESULTS_COLLECTION),
      where('email', '==', email.toLowerCase())
    );

    const querySnapshot = await Promise.race([
      getDocs(emailQuery),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore query timeout')), 5000)
      )
    ]);

    const emailExists = !querySnapshot.empty;

    if (emailExists) {
      const existingSpins = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        exists: true,
        count: existingSpins.length,
        lastSpin: existingSpins[0],
        source: 'firestore'
      };
    }

    return { exists: false, count: 0, source: 'firestore' };

  } catch (error) {
    // Fallback to localStorage only
    const localData = JSON.parse(localStorage.getItem('boraqSpinResults') || '[]');
    const localEmailExists = localData.some(entry =>
      entry.email && entry.email.toLowerCase() === email.toLowerCase()
    );

    return {
      exists: localEmailExists,
      count: localEmailExists ? 1 : 0,
      source: 'localStorage',
      offline: true
    };
  }
};

// Log spin result to both Firestore and localStorage
export const logSpinResult = async (user, prizeName) => {
  const spinData = {
    userId: user.uid,
    email: user.email.toLowerCase(),
    userName: user.name,
    userPhoto: user.photo,
    prizeName: prizeName,
    timestamp: Timestamp.now(),
    createdAt: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ipAddress: 'client-side' // Will be filled by server if needed
  };

  // Always save to localStorage first
  try {
    const localData = JSON.parse(localStorage.getItem('boraqSpinResults') || '[]');
    localData.push({ ...spinData, timestamp: new Date().toISOString() });
    localStorage.setItem('boraqSpinResults', JSON.stringify(localData));
  } catch (localError) {
    // localStorage failed, continue anyway
  }

  // Try to save to Firestore
  try {
    const docRef = await addDoc(collection(db, SPIN_RESULTS_COLLECTION), spinData);

    return {
      success: true,
      id: docRef.id,
      data: spinData,
      savedTo: ['firestore', 'localStorage']
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: spinData,
      savedTo: ['localStorage'],
      offline: true
    };
  }
};

// Get recent spin results (admin function)
export const getRecentSpins = async (limit = 50) => {
  try {
    const spinsQuery = query(
      collection(db, SPIN_RESULTS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limit)
    );

    const querySnapshot = await getDocs(spinsQuery);
    const spins = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: spins,
      count: spins.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
