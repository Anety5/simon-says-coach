import 'dotenv/config';

export default {
  expo: {
    name: "Simon Says Coach",
    slug: "simon-says-coach",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.simonsayscoach"
    },
    android: {
      package: "com.anonymous.simonsayscoach",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#D4735E"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      EXPO_PUBLIC_GEMINI_API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || "AIzaSyCgATlIG-zTGIolKAsWliJgkKmzuM2KcyE",
      EXPO_PUBLIC_REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || "",
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
