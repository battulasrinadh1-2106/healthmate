# HealthMate Play Store Ready - EXACT BUILD COMMANDS

## ⚠️ CRITICAL SETUP (One-Time)

### Step 1: Generate Keystore
```bash
cd android

# Generate keystore (prompts for password - remember it!)
keytool -genkey -v \
  -keystore upload-keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10950 \
  -alias healthmate-upload

# You'll be prompted for:
# - Keystore password: __________ (create a strong password)
# - Key password: __________ (same as keystore password recommended)
# - First/Last Name: HealthMate App
# - Organization: HealthMate
# - City: Your City
# - Country: US

cd ..
```

### Step 2: Create Keystore Properties File
```bash
# After running keytool, copy the passwords and create this file:
cat > android/keystore.properties << 'EOF'
storeFile=upload-keystore.jks
storePassword=PASTE_YOUR_KEYSTORE_PASSWORD_HERE
keyAlias=healthmate-upload
keyPassword=PASTE_YOUR_KEY_PASSWORD_HERE
EOF

# Verify the file was created
cat android/keystore.properties
```

⚠️ **SECURITY WARNING**: Never commit `keystore.properties` or `upload-keystore.jks` to git!

---

## 🚀 BUILD PROCESS (Every Release)

### Option 1: Automated Build Script (Recommended)

```bash
# 1. Set environment variables (CRITICAL!)
export NODE_ENV=production
export MONGODB_URI="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/?appName=healthmate"
export GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-gmail-app-password"
export VITE_API_BASE_URL="https://api.healthmate.app"
export APP_URL="https://api.healthmate.app"

# 2. Run the build script
chmod +x build-release.sh
./build-release.sh

# Output: android/app/build/outputs/bundle/release/app-release.aab ✅
```

### Option 2: Manual Build Commands

```bash
# 1. Set environment variables
export NODE_ENV=production
export MONGODB_URI="mongodb+srv://USER:PASS@CLUSTER.mongodb.net/?appName=healthmate"
export GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
export SMTP_USER="your-email@gmail.com"
export SMTP_PASS="your-gmail-app-password"
export VITE_API_BASE_URL="https://api.healthmate.app"
export APP_URL="https://api.healthmate.app"

# 2. Install dependencies
npm install

# 3. Build frontend
npm run build

# 4. Verify frontend build
ls -la dist/index.html

# 5. Sync Capacitor to Android
npx cap sync android

# 6. Build release AAB
cd android
./gradlew clean
./gradlew bundleRelease
cd ..

# 7. Verify output
ls -lh android/app/build/outputs/bundle/release/app-release.aab
```

---

## 📋 ENVIRONMENT VARIABLES REQUIRED

All of these MUST be set before building:

```bash
# Node environment
NODE_ENV=production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://healthmate-db:PASSWORD@healthmate-db.xxxxx.mongodb.net/?appName=healthmate

# AI API (Google Gemini)
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Email (Gmail SMTP)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_gmail_app_password  # NOT your Gmail password!
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SENDER_NAME=HealthMate Support

# Frontend API
VITE_API_BASE_URL=https://api.healthmate.app
APP_URL=https://api.healthmate.app
```

**To get Gmail app password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-factor authentication
3. Create app-specific password for HealthMate
4. Use that password in SMTP_PASS

---

## ✅ VERIFICATION COMMANDS

Run these to verify your build is correct:

```bash
# 1. Check frontend build
echo "Frontend build:"
ls -la dist/index.html
grep "HealthMate - Smart Health Companion" dist/index.html && echo "✅ Title correct" || echo "❌ Title incorrect"

# 2. Check Capacitor sync
echo ""
echo "Capacitor sync:"
ls -la android/app/src/main/assets/public/index.html && echo "✅ Web assets copied" || echo "❌ Assets missing"

# 3. Check Android build config
echo ""
echo "Android build configuration:"
grep "versionCode 100" android/app/build.gradle && echo "✅ Version code correct" || echo "⚠️ Version code wrong"
grep "minifyEnabled true" android/app/build.gradle && echo "✅ ProGuard enabled" || echo "❌ ProGuard disabled"
grep "ACTIVITY_RECOGNITION" android/app/src/main/AndroidManifest.xml && echo "✅ Permissions correct" || echo "❌ Permissions wrong"

# 4. Check AAB output
echo ""
echo "Release AAB:"
ls -lh android/app/build/outputs/bundle/release/app-release.aab && echo "✅ AAB created" || echo "❌ AAB not found"
file android/app/build/outputs/bundle/release/app-release.aab | grep -q Zip && echo "✅ AAB is valid ZIP" || echo "❌ AAB invalid"
```

---

## 🎯 TROUBLESHOOTING

### Issue: "keystore.properties not found"
**Solution:**
```bash
cd android
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10950 -alias healthmate-upload
# Then create keystore.properties with the values
```

### Issue: "MONGODB_URI is required in production"
**Solution:**
```bash
# Check if environment variable is set
echo $MONGODB_URI

# If empty, set it:
export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/?appName=healthmate"
```

### Issue: "GEMINI_API_KEY environment variable is required"
**Solution:**
```bash
# Check if environment variable is set
echo $GEMINI_API_KEY

# If empty, set it:
export GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

### Issue: "Invalid keystore password"
**Solution:**
```bash
# Verify keystore exists and check the password
keytool -list -v -keystore android/upload-keystore.jks -storepass YOUR_PASSWORD

# Verify keystore.properties has matching password
cat android/keystore.properties
```

### Issue: "AAB file is not signed"
**Solution:**
```bash
# Check if keystore.properties is properly configured
cat android/keystore.properties

# Verify all 4 values are present:
# - storeFile=upload-keystore.jks ✅
# - storePassword=XXXX ✅
# - keyAlias=healthmate-upload ✅
# - keyPassword=XXXX ✅

# Rebuild
cd android
./gradlew clean
./gradlew bundleRelease
cd ..
```

---

## 📤 UPLOADING TO PLAY STORE

1. **Go to Google Play Console**
   - URL: https://play.google.com/console/
   - Sign in with Google account

2. **Create New App (or select existing)**
   - App name: HealthMate
   - Default language: English
   - App category: Health & Fitness
   - App type: Free

3. **Upload AAB**
   - Go to Release → Production
   - Click "Create new release"
   - Upload file: `android/app/build/outputs/bundle/release/app-release.aab`

4. **Complete Store Listing**
   - Short description (80 chars): "Smart Digital Health Companion"
   - Full description (4000 chars): Feature list, benefits, etc.
   - Screenshots: 4 minimum (different screen sizes)
   - Feature image: 1024×500 PNG
   - Icon: 512×512 PNG
   - Category: Health & Fitness
   - Content rating: Complete questionnaire

5. **Submit for Review**
   - Click "Review release"
   - Review all information
   - Click "Start rollout to Production"
   - Wait for Google to review (typically 2-3 hours)

---

## 🔐 SECURITY CHECKLIST

Before uploading to Play Store:

- [ ] No API keys in `.env` file
- [ ] No passwords in `.env` file
- [ ] `.env` file is in `.gitignore`
- [ ] `keystore.properties` is in `.gitignore`
- [ ] `upload-keystore.jks` is backed up securely (not in git)
- [ ] All environment variables use HTTPS URLs
- [ ] MONGODB_URI set to production MongoDB Atlas
- [ ] GEMINI_API_KEY set to valid API key
- [ ] SMTP credentials set to Gmail app password (not Gmail password)
- [ ] All permissions are necessary and justified
- [ ] ProGuard minification is enabled
- [ ] No console.logs in release build

---

## 📊 FINAL COMMANDS SUMMARY

**One-time setup (10 minutes):**
```bash
cd android
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10950 -alias healthmate-upload
# Create android/keystore.properties with passwords
cd ..
```

**For each release (20 minutes):**
```bash
export NODE_ENV=production
export MONGODB_URI="..."
export GEMINI_API_KEY="..."
export SMTP_USER="..."
export SMTP_PASS="..."
export VITE_API_BASE_URL="https://api.healthmate.app"

npm install
npm run build
npx cap sync android
cd android && ./gradlew bundleRelease && cd ..

# Output: android/app/build/outputs/bundle/release/app-release.aab ✅
```

**Total time:** ~30 minutes from git clone to Play Store ready AAB 🚀

---

## ✅ STATUS

**All critical blockers have been fixed!**

- ✅ Security credentials secured
- ✅ Keystore setup documented
- ✅ Frontend production config ready
- ✅ Android build hardened
- ✅ Permissions updated
- ✅ ProGuard enabled
- ✅ Version numbers updated
- ✅ HTML metadata fixed

**You are ready to submit to the Play Store!** 🎉

