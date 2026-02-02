# Google Sheets Integration Setup Guide

This guide will help you fix the "The caller does not have permission" error when creating Google Sheets templates.

## The Problem

Your app is missing the `GOOGLE_SERVICE_ACCOUNT_KEY` environment variable, which is required for authenticating with Google's APIs.

## Solution

Follow these steps to set up Google Sheets integration:

### Step 1: Enable Required Google APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project: `wealth-tracker-485215`
3. Enable **Google Sheets API**:
   - Visit: https://console.cloud.google.com/apis/library/sheets.googleapis.com?project=wealth-tracker-485215
   - Click **"Enable"**
4. Enable **Google Drive API**:
   - Visit: https://console.cloud.google.com/apis/library/drive.googleapis.com?project=wealth-tracker-485215
   - Click **"Enable"**

### Step 2: Create or Locate Service Account

1. Go to [Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts?project=wealth-tracker-485215)
2. Look for: `wealthtrack-sheets@wealth-tracker-485215.iam.gserviceaccount.com`

**If the service account doesn't exist:**
1. Click **"Create Service Account"**
2. Service account name: `wealthtrack-sheets`
3. Service account ID: `wealthtrack-sheets`
4. Click **"Create and Continue"**
5. Grant roles:
   - **Editor** (or at minimum: "Service Account User")
6. Click **"Done"**

### Step 3: Create and Download Service Account Key

1. Click on the service account email
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** format
5. Click **"Create"**
6. A JSON file will download automatically - save it securely!

### Step 4: Add Credentials to Environment Variables

You have two options:

#### Option A: Base64 Encode (Recommended for Production)

1. Open Terminal and run:
```bash
cat ~/Downloads/wealth-tracker-485215-*.json | base64
```

2. Copy the output (the long base64 string)

3. Open `/Users/justinleu/wealthtrack-app/.env.local`

4. Set the variable:
```bash
GOOGLE_SERVICE_ACCOUNT_KEY=<paste the base64 string here>
```

#### Option B: Direct JSON (Easier for Local Development)

1. Open the downloaded JSON file in a text editor

2. Copy the entire contents

3. Open `/Users/justinleu/wealthtrack-app/.env.local`

4. Paste the JSON on one line (escape newlines):
```bash
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"wealth-tracker-485215",...}'
```

### Step 5: Restart Your Development Server

After adding the environment variable:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

### Step 6: Test the Integration

1. Go to **Settings** page in your app
2. Click **"Create Template Sheet"**
3. The sheet should now be created successfully!

## Troubleshooting

### Still Getting Permission Errors?

1. **Check API Status**: Make sure both APIs are enabled:
   - [Sheets API Dashboard](https://console.cloud.google.com/apis/api/sheets.googleapis.com?project=wealth-tracker-485215)
   - [Drive API Dashboard](https://console.cloud.google.com/apis/api/drive.googleapis.com?project=wealth-tracker-485215)

2. **Verify Service Account Permissions**:
   - Go to [IAM page](https://console.cloud.google.com/iam-admin/iam?project=wealth-tracker-485215)
   - Find `wealthtrack-sheets@wealth-tracker-485215.iam.gserviceaccount.com`
   - Make sure it has **Editor** role or at minimum:
     - "Service Account User"
     - "Service Usage Consumer"

3. **Check Environment Variable**:
```bash
# In your terminal, verify the variable is set:
cd /Users/justinleu/wealthtrack-app
grep GOOGLE_SERVICE_ACCOUNT_KEY .env.local
```

4. **View Server Logs**: Check the terminal where your dev server is running for detailed error messages

### Common Error Messages

- **"Drive API has not been enabled"**: Enable Drive API in Step 1
- **"Sheets API has not been enabled"**: Enable Sheets API in Step 1
- **"Invalid credentials"**: Re-download the service account key
- **"Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY"**: Make sure there are no extra spaces or line breaks

## For Vercel Deployment

When deploying to Vercel, add the environment variable:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add `GOOGLE_SERVICE_ACCOUNT_KEY`
4. Use the **base64-encoded** value (Option A above)
5. Make sure it's available for all environments (Production, Preview, Development)

## Security Notes

- **Never commit** the `.env.local` file to Git
- The service account key is sensitive - treat it like a password
- Store the JSON key file securely (consider using a password manager)
- For production, use Vercel's environment variables instead of committing the key
