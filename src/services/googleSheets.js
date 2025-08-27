// Google Sheets API service for logging spin data
const SHEETS_API_KEY = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const SHEET_NAME = 'SpinData'; // Name of the sheet tab

// Base Google Sheets API URL
const SHEETS_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

// Check if email already exists in the sheet
export const checkEmailExists = async (email) => {
  try {
    const range = `${SHEET_NAME}!C:C`; // Column C contains emails
    const url = `${SHEETS_BASE_URL}/values/${range}?key=${SHEETS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.values) {
      // Check if email exists in any row (case insensitive)
      const emailExists = data.values.some(row =>
        row[0] && row[0].toLowerCase() === email.toLowerCase()
      );
      return emailExists;
    }

    return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false; // If error, allow spin (fail gracefully)
  }
};

// Log spin result to Google Sheets
export const logSpinResult = async (userData, prizeWon) => {
  try {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const spinId = `spin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare row data: [Timestamp, Name, Email, Prize Won, UID, SpinID, Source, Status, Notes]
    const rowData = [
      timestamp,
      userData.name || 'Unknown',
      userData.email,
      prizeWon,
      userData.uid,
      spinId,
      'BoothAUST',
      'Won',
      'Automated entry'
    ];

    // Use Google Apps Script Web App or direct API call
    // For now, we'll use the append method via Google Sheets API
    const range = `${SHEET_NAME}!A:I`;
    const url = `${SHEETS_BASE_URL}/values/${range}:append?valueInputOption=RAW&key=${SHEETS_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData]
      })
    });

    if (response.ok) {
      console.log('Spin result logged successfully');
      return { success: true, spinId };
    } else {
      throw new Error('Failed to log to sheets');
    }

  } catch (error) {
    console.error('Error logging spin result:', error);
    return { success: false, error: error.message };
  }
};

// Initialize sheet headers if needed
export const initializeSheet = async () => {
  try {
    const headers = [
      'Timestamp', 'Name', 'Email', 'Prize Won', 'UID',
      'SpinID', 'Source', 'Status', 'Notes'
    ];

    // This would typically be done once manually or via a setup script
    console.log('Sheet headers should be:', headers);
    return { success: true };
  } catch (error) {
    console.error('Error initializing sheet:', error);
    return { success: false, error: error.message };
  }
};
