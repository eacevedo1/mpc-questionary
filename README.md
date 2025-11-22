# Questionnaire Setup Guide

## Files Created
- `index.html` - Main questionnaire page
- `styles.css` - Styling for the questionnaire
- `script.js` - JavaScript to handle form submission to Google Sheets

## How to Connect to Your Google Sheet

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Questionnaire Responses"
4. In the first row, add headers: `Timestamp`, `Name`, `Email`, `Satisfaction`, `Features`, `Feedback`

### Step 2: Create a Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy and paste the following code:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);
    
    // Append a new row with the data
    sheet.appendRow([
      data.timestamp,
      data.name,
      data.email,
      data.satisfaction,
      data.features,
      data.feedback
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'row': sheet.getLastRow()
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'error': error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the **disk icon** (💾) to save
5. Name your project (e.g., "Questionnaire Handler")

### Step 3: Deploy the Script as a Web App
1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Select **Web app**
4. Configure the deployment:
   - **Description**: "Questionnaire form handler" (or any description)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone** (important!)
5. Click **Deploy**
6. Review permissions:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. Copy the **Web app URL** (it should look like: `https://script.google.com/macros/s/LONG_ID_HERE/exec`)

### Step 4: Update script.js
Open `script.js` and replace:

```javascript
const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
```

With your actual Web App URL:

```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
```

### Step 5: Test Your Form
1. Open `index.html` in your browser
2. Fill out the questionnaire
3. Click Submit
4. Check your Google Sheet - a new row should appear with the submitted data!

## Customization Tips

### Modify Questions
Edit `index.html` to add, remove, or modify questions. If you add new fields:
1. Update the data collection in `script.js` (around line 10)
2. Update the Google Apps Script to include the new field
3. Add a corresponding column header in your Google Sheet

### Change Colors
Edit `styles.css` to customize the color scheme:
- Lines 8-9: Background gradient colors
- Line 86: Button gradient colors

### Modify Data Format
In the Google Apps Script, you can:
- Format the timestamp differently
- Add data validation
- Send email notifications when form is submitted
- Redirect to different sheets based on responses

## Troubleshooting

**Data not appearing in Google Sheet?**
- Verify the Web App URL is correct in `script.js`
- Ensure deployment is set to "Anyone" can access
- Check that column headers match the script
- Open Apps Script and check **Executions** log for errors

**Permission errors?**
- Re-deploy the script
- Make sure "Execute as: Me" is selected
- Ensure you authorized the script properly

**CORS errors?**
- This is normal and expected
- The `no-cors` mode means you won't see responses, but data still submits
- Check your Google Sheet to confirm submission worked

**Want to update the script?**
1. Make changes in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (pencil)
4. Update version to "New version"
5. Click **Deploy**
6. The URL stays the same, no need to update `script.js`
