# MPC Questionnaire - Music Perception and Cognition Study

## Overview
This questionnaire collects data for a music perception study involving pitch discrimination tasks in different contexts (isolated tones, familiar melody, unfamiliar melody).

## Files
- `index.html` - Main questionnaire interface
- `styles.css` - Styling and visual design
- `script.js` - Client-side logic and data handling
- `dopost.appscript` - Google Apps Script for data collection
- `data/task1_isolated_tones/` - Audio files for isolated tone discrimination
- `data/task2_melody_D4/` - Audio files for familiar melody (D4 alterations)
- `data/task2_melody_F4/` - Audio files for familiar melody (F4 alterations)

## Data Collection Structure

### Task 1: Pitch Discrimination for Isolated Tones
The questionnaire collects detailed trial-by-trial data including:
- **Audio file played** (e.g., `tone_pair_delta_+05Hz.wav`)
- **User response** (Same, Higher, or Lower)
- **Correct answer**
- **Result** (Correct/Incorrect)
- **Start timestamp** (when the trial page was shown)
- **Response timestamp** (when user submitted their answer)

Each participant completes:
- 1 practice trial (with feedback)
- 6 test trials (without feedback)

## Google Sheets Setup

### Step 1: Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "MPC Questionnaire Responses"

### Step 2: Set Up Google Apps Script
1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any default code
3. Copy and paste the **entire contents** of `dopost.appscript` file
4. Click the **disk icon** (💾) to save
5. Name your project "MPC Data Handler"

### Step 3: Set Up Column Headers (Important!)
1. In the Apps Script editor, find the function dropdown (top toolbar)
2. Select **setupHeaders** from the dropdown
3. Click the **Run** button (▶️)
4. Authorize the script:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
5. Your Google Sheet will now have all the proper column headers automatically!

**Expected columns:**
- Demographics (Age, Country, Gender, etc.)
- Task 1 Accuracy
- Task 1 Trial details (7 trials × 6 columns each = 42 columns):
  - Practice trial + 6 test trials
  - Each trial: Audio File, User Response, Correct Answer, Result, Start Time, Response Time
- Task 2 Response
- Task 3 Response
- Feedback
- Completion Timestamp

### Step 4: Deploy as Web App
### Step 4: Deploy as Web App
1. In Apps Script, click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description**: "MPC Questionnaire Handler"
   - **Execute as**: **Me**
   - **Who has access**: **Anyone**
5. Click **Deploy**
6. Copy the **Web app URL**

### Step 5: Update script.js
Open `script.js` and update line 3:

```javascript
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec';
```

### Step 6: Test
1. Open `index.html` in a browser
2. Complete the questionnaire
3. Check your Google Sheet for the new row with all trial data!

## Understanding the Data

### Task 1 Data Columns
For each trial (practice + 6 test trials), you'll see:
1. **Audio File**: Which tone pair was played (e.g., `tone_pair_delta_+05Hz.wav`)
2. **User Response**: What the participant answered (Same/Higher/Lower)
3. **Correct Answer**: The actual correct answer
4. **Result**: Whether they got it correct or incorrect
5. **Start Time**: When the trial page was displayed
6. **Response Time**: When they submitted their answer

### Analyzing Response Time
You can calculate how long each participant took per trial by computing the difference between Start Time and Response Time.

### Task 1 Accuracy
The "Task 1 Accuracy" column shows the overall percentage correct (practice trial not included in calculation).

## Customization

### Modify Questions
Edit `index.html` sections for demographics or task instructions.

### Change Audio Files
Add/replace files in the `data/` folders and update the file arrays in `script.js`.

### Adjust Number of Trials
Currently set to 1 practice + 6 test trials. To change:
1. Update HTML pages in `index.html`
2. Update loop in `setupTask1Pages()` function in `script.js`
3. Update `dopost.appscript` trial count (line 28)
4. Re-run `setupHeaders()` in Apps Script

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
