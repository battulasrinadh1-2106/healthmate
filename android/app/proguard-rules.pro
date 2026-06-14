# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# HealthMate Specific Rules

# Keep Capacitor native bridge
-keep public class com.getcapacitor.** { *; }
-keep public class * extends com.getcapacitor.Plugin { public <init>(...); }

# Keep Android support libraries
-keep public class androidx.** { *; }

# Keep WebView interface classes
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep JSON parsing classes (if using org.json or similar)
-keep public class org.json.** { *; }

# Keep model classes used by reflection
-keep class com.healthmate.** { *; }

# Preserve line number information for debugging stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep exceptions
-keep public class * extends java.lang.Exception { *; }
-keep public class * extends java.lang.Throwable { *; }

# Remove logging in release builds
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
}

# Optimization settings
-optimizationpasses 5
-dontusemixedcaseclassnames
-verbose

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}
