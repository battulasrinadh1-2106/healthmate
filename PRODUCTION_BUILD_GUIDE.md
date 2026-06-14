# HealthMate Production Build Guide

## Pre-Build Checklist

- [ ] Keystore created and `android/keystore.properties` configured
- [ ] All environment variables set in CI/CD:
  - [ ] `MONGODB_URI` - MongoDB Atlas connection string
  - [ ] `GEMINI_API_KEY` - Google Gemini API key
  - [ ] `SMTP_USER` - Gmail address for OTP emails
  - [ ] `SMTP_PASS` - Gmail app password
  - [ ] `VITE_API_BASE_URL` - Production API URL (HTTPS)
  - [ ] `NODE_ENV=production`
- [ ] `.env` file is EMPTY or contains only placeholders
- [ ] `.env` is in `.gitignore` and not committed
- [ ] `android/keystore.properties` is in `.gitignore` and not committed
- [ ] `android/upload-keystore.jks` is in `.gitignore` and not committed

## Build Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Frontend
```bash
npm run build
```

Expected output: `dist/` folder with HTML, CSS, JS files

### Step 3: Verify Frontend Build
```bash
# Check that dist/index.html exists and has correct title
grep "HealthMate" dist/index.html

# Should output: <title>HealthMate - Smart Health Companion</title>
```

### Step 4: Sync Capacitor Android
```bash
npx cap sync android
```

Expected output: Web assets copied to `android/app/src/main/assets/`

### Step 5: Verify Android Configuration
```bash
# Check that versionCode is updated
grep "versionCode" android/app/build.gradle

# Check that ProGuard is enabled
grep "minifyEnabled" android/app/build.gradle

# Check that permissions are correct
grep "ACTIVITY_RECOGNITION" android/app/src/main/AndroidManifest.xml
```

### Step 6: Build Release AAB
```bash
cd android

# Clean previous builds
./gradlew clean

# Build release AAB (Android App Bundle)
./gradlew bundleRelease
```

Expected output: `app/build/outputs/bundle/release/app-release.aab`

### Step 7: Sign the AAB
The AAB is automatically signed during `bundleRelease` if `keystore.properties` is configured correctly.

Verify signing:
```bash
# Check file exists and has size > 10MB
ls -lh app/build/outputs/bundle/release/app-release.aab

# Example output:
# -rw-r--r--  1 user  group  12.5M app/build/outputs/bundle/release/app-release.aab
```

### Step 8: Upload to Play Store
```bash
# Download Android Studio or use bundletool
# Go to Google Play Console
# - Create new release
# - Upload app-release.aab
# - Add release notes
# - Review app content rating questionnaire
# - Check Play Store requirements
```

## Environment Variables (CI/CD Setup)

### GitHub Actions Example
```yaml
env:
  NODE_ENV: production
  MONGODB_URI: ${{ secrets.MONGODB_URI }}
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  SMTP_USER: ${{ secrets.SMTP_USER }}
  SMTP_PASS: ${{ secrets.SMTP_PASS }}
  VITE_API_BASE_URL: https://api.healthmate.app
  APP_URL: https://api.healthmate.app
```

### Vercel/Netlify Example
Set in project settings → Environment Variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `SMTP_USER` - Gmail sender
- `SMTP_PASS` - Gmail app password
- `VITE_API_BASE_URL` - API endpoint (same as deployment URL)
- `NODE_ENV` - `production`

## Testing the Build

### Local Testing (Before Upload)
```bash
# Build and run on Android emulator/device
cd android
./gradlew installRelease

# Or build APK for testing
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

### Production Validation
1. **API Endpoint Check**: Verify VITE_API_BASE_URL points to production
2. **Database Check**: Verify MONGODB_URI connects to production Atlas
3. **Email Check**: Send test OTP to verify SMTP settings
4. **Gemini Check**: Verify food roasting works with API key

## Troubleshooting

### Build Fails - "keystore.properties not found"
```bash
# Create keystore.properties in android/
echo "storeFile=upload-keystore.jks
storePassword=your-password
keyAlias=healthmate-upload
keyPassword=your-password" > android/keystore.properties
```

### Build Fails - "Missing MONGODB_URI"
```bash
# Set environment variable before building
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/?appName=healthmate"
npm run build
```

### APK/AAB Size Too Large
ProGuard minification should reduce size. If still large:
1. Remove unused dependencies: `npm prune`
2. Check for duplicate libraries
3. Use `bundletool` to analyze: `bundletool analyze-bundle --bundle=app-release.aab`

### Signing Fails
```bash
# Verify keystore password
keytool -list -v -keystore android/upload-keystore.jks

# Check keystore.properties matches
cat android/keystore.properties
```

## Security Checklist

- ✅ No API keys in `.env` (only in CI/CD secrets)
- ✅ No passwords in `.env` (only in CI/CD secrets)
- ✅ No keystore.properties in git
- ✅ No upload-keystore.jks in git
- ✅ HTTPS enforced for all API calls
- ✅ ProGuard enabled for code obfuscation
- ✅ Database enforces production URI in production builds
- ✅ OTP tokens expire after 3 minutes
- ✅ Reset links expire after 30 minutes
- ✅ Console logging removed from release builds

## Version Management

Before each release:
1. Update `versionCode` in `android/app/build.gradle`
   - Increment by 1 for each release
   - Current: 100
   - Next: 101

2. Update `versionName` in `android/app/build.gradle`
   - Format: `major.minor.patch`
   - Current: 1.0.0
   - Next: 1.0.1 (for bug fixes) or 1.1.0 (for features)

3. Update `version` in `package.json` to match

4. Tag the release:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

## Play Store Submission

### Required Assets
- App icon (512×512 PNG)
- Feature graphics (1024×500 PNG)
- Screenshots (4 minimum, different screen sizes)
- Short description (80 characters max)
- Full description (4000 characters max)
- Release notes

### Content Rating Questionnaire
Answer honestly about:
- Violence, profanity, substance use
- User-generated content
- Financial transactions

### App Review
Google Play typically reviews within 2-3 hours. Check for rejections:
- Inappropriate content
- Misleading claims
- Security issues
- Policy violations

### Common Rejection Reasons
1. **Signature mismatch**: Ensure same keystore for all updates
2. **Missing permissions**: All required permissions must be in manifest
3. **Targeting wrong SDK**: Target SDK must be current (36)
4. **Privacy policy**: Required at app launch
5. **Test accounts**: Provide working test credentials if needed

