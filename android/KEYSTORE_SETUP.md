# Android Keystore Setup Guide

## ⚠️ CRITICAL: This file is required for Play Store release builds

### Step 1: Generate a Keystore (if you don't have one)

```bash
# Navigate to android folder
cd android

# Generate keystore using keytool (included with Java)
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10950 -alias healthmate-upload

# When prompted, provide:
# - Keystore password: (create a strong password, remember it)
# - Key password: (should match keystore password for simplicity)
# - First and Last Name: HealthMate App
# - Organizational Unit: Engineering
# - Organization: HealthMate Inc
# - City/Locality: Your City
# - State/Province: Your State
# - Country Code: Your Country Code (US)

# Output: upload-keystore.jks will be created
```

### Step 2: Create keystore.properties file

Create `android/keystore.properties` with the EXACT values from your keystore:

```properties
storeFile=upload-keystore.jks
storePassword=your-keystore-password-here
keyAlias=healthmate-upload
keyPassword=your-key-password-here
```

### Step 3: Move keystore to android folder

```bash
# The upload-keystore.jks file should be in the android folder
# It will be referenced as relative path from android/keystore.properties
```

### ⚠️ SECURITY NOTES

1. **NEVER commit keystore.properties to git** - It contains passwords
2. **NEVER commit upload-keystore.jks to git** - It's your signing key
3. **BACKUP your upload-keystore.jks securely** - Losing it means you can't update the app on Play Store
4. Add these to .gitignore:
   ```
   android/upload-keystore.jks
   android/keystore.properties
   ```

### Verify Setup

```bash
cd android
# This should successfully load the keystore
./gradlew tasks
```

### Generate AAB

```bash
cd android
./gradlew bundleRelease
# Output: app/build/outputs/bundle/release/app-release.aab
```

### Troubleshooting

**Error: "keystore.properties" not found**
- Make sure you created android/keystore.properties with correct values

**Error: "storeFile" not found**
- Make sure upload-keystore.jks is in the android folder
- Check the relative path in keystore.properties

**Error: "Alias does not contain a private key"**
- Verify the keyAlias matches what you created with keytool

