/**
 * Google Apps Script for Boraq Spin-to-Win Backend
 * This script handles all Google Sheets operations for the prize spinner
 *
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Update the SHEET_ID below with your Google Sheet ID
 * 5. Deploy as a Web App:
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 6. Copy the deployment URL and update it in your React app
 */

// Configuration - UPDATE THIS WITH YOUR SHEET ID
const SHEET_ID = '1XDFD_xlKj3LUDR5vH9iNiiYFY43GPI-llaKFD8Vc7oM';

/**
 * Handle all incoming requests (POST, GET, OPTIONS)
 */
function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function doOptions(e) {
  return createCORSResponse({
    success: true,
    message: 'CORS preflight successful'
  });
}

function handleRequest(e) {
  try {
    console.log('Received request:', e);

    // Handle different request types
    let data = {};

    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    console.log('Parsed data:', data);

    const action = data.action || 'test';
    const sheetName = data.sheetName || 'Boraq_Spin_Results';

    // Route to appropriate function based on action
    switch (action) {
      case 'checkEmail':
        return createCORSResponse(checkEmailExists(data.email, sheetName));

      case 'addRow':
        return createCORSResponse(addSpinResult(data.data, sheetName));

      case 'initializeSheet':
        return createCORSResponse(initializeSheetHeaders(sheetName));

      case 'test':
      default:
        return createCORSResponse({
          success: true,
          message: 'Boraq Spin-to-Win Backend is running!',
          timestamp: new Date().toISOString(),
          action: action,
          receivedData: data
        });
    }

  } catch (error) {
    console.error('Error in handleRequest:', error);
    return createCORSResponse({
      success: false,
      error: error.toString(),
      message: 'Script execution failed'
    });
  }
}

/**
 * Check if an email already exists in the sheet
 */
function checkEmailExists(email, sheetName) {
  try {
    console.log('Checking email:', email, 'in sheet:', sheetName);

    const sheet = getSheet(sheetName);
    if (!sheet) {
      return { success: false, error: 'Sheet not found', emailExists: false };
    }

    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();

    if (values.length <= 1) {
      // Only headers or empty sheet
      console.log('Sheet is empty or only has headers');
      return { success: true, emailExists: false, email: email };
    }

    // Check if email exists (case insensitive, skip header row)
    // Assuming email is in column C (index 2)
    const emailExists = values.slice(1).some(row => {
      return row[2] && row[2].toString().toLowerCase() === email.toLowerCase();
    });

    console.log(`Email ${email} exists: ${emailExists}`);

    return {
      success: true,
      emailExists: emailExists,
      email: email,
      totalRows: values.length - 1
    };

  } catch (error) {
    console.error('Error checking email:', error);
    return {
      success: false,
      error: error.toString(),
      emailExists: false // Default to false if error
    };
  }
}

/**
 * Add a new spin result to the sheet
 */
function addSpinResult(data, sheetName) {
  try {
    console.log('Adding spin result:', data, 'to sheet:', sheetName);

    const sheet = getSheet(sheetName);
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }

    // Initialize headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      console.log('Sheet is empty, initializing headers');
      initializeSheetHeaders(sheetName);
    }

    // Prepare row data in the correct order
    const rowData = [
      data.timestamp || new Date().toLocaleString(),
      data.name || 'Unknown',
      data.email || 'unknown@email.com',
      data.prize || 'Unknown Prize',
      data.uid || 'unknown-uid',
      data.spinId || 'unknown-spin-id',
      data.source || 'BoothAUST',
      data.status || 'Won',
      data.notes || 'Automated entry'
    ];

    // Add the row
    sheet.appendRow(rowData);

    const newRowNumber = sheet.getLastRow();
    console.log('Successfully added row:', newRowNumber, rowData);

    return {
      success: true,
      message: 'Spin result logged successfully',
      data: data,
      rowData: rowData,
      row: newRowNumber,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error adding spin result:', error);
    return {
      success: false,
      error: error.toString(),
      message: 'Failed to add spin result'
    };
  }
}

/**
 * Initialize sheet with headers if empty
 */
function initializeSheetHeaders(sheetName) {
  try {
    console.log('Initializing headers for sheet:', sheetName);

    const sheet = getSheet(sheetName);
    if (!sheet) {
      return { success: false, error: 'Sheet not found' };
    }

    // Check if sheet already has headers
    if (sheet.getLastRow() > 0) {
      console.log('Sheet already has data');
      return {
        success: true,
        message: 'Sheet already has headers',
        currentRows: sheet.getLastRow()
      };
    }

    // Add headers
    const headers = [
      'Timestamp', 'Name', 'Email', 'Prize Won', 'UID',
      'SpinID', 'Source', 'Status', 'Notes'
    ];

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#e1f5fe');
    headerRange.setBorder(true, true, true, true, true, true);

    console.log('Headers initialized successfully');

    return {
      success: true,
      message: 'Headers initialized successfully',
      headers: headers
    };

  } catch (error) {
    console.error('Error initializing headers:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Get or create a sheet by name
 */
function getSheet(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(sheetName);

    // Create sheet if it doesn't exist
    if (!sheet) {
      console.log(`Creating new sheet: ${sheetName}`);
      sheet = spreadsheet.insertSheet(sheetName);
    }

    return sheet;

  } catch (error) {
    console.error('Error accessing sheet:', error);
    throw new Error(`Failed to access sheet: ${error.toString()}`);
  }
}

/**
 * Create a properly formatted CORS-enabled response
 */
function createCORSResponse(data) {
  const response = ContentService
    .createTextOutput(JSON.stringify(data, null, 2))
    .setMimeType(ContentService.MimeType.JSON);

  // Add CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Max-Age', '3600');

  return response;
}
