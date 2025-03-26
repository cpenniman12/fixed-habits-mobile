# Fixed Habits Mobile App

This is a fixed version of the habits-mobile app with compatibility issues resolved, particularly the error with expo-secure-store.

## What's Fixed

- Removed `expo-secure-store` dependency, which was causing the error:
  ```
  Package "expo-secure-store" does not contain a valid config plugin.
  Learn more: https://docs.expo.dev/guides/config-plugins/#creating-a-plugin
  Unexpected token 'typeof'
  ```

## How to Run

1. Clone this repository:
   ```bash
   git clone https://github.com/cpenniman12/fixed-habits-mobile.git
   cd fixed-habits-mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables by creating a `.env` file based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   Then edit the `.env` file with your Supabase and Claude API credentials.

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Press `i` in the terminal to launch the iOS simulator.

## Alternative: Running Directly in Xcode

If you prefer to run the app directly in Xcode:

1. Generate the iOS project files:
   ```bash
   npx expo prebuild -p ios
   ```

2. Open the generated Xcode project:
   ```bash
   cd ios
   pod install
   cd ..
   open ios/Eighteen.xcworkspace
   ```

3. In Xcode, select your preferred simulator from the device dropdown and click the "Run" button.

## Troubleshooting

If you encounter any issues:

1. Make sure you're using a compatible Node.js version (Node.js 18.x recommended)
2. Try cleaning the cache:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```
3. If you see warnings about deprecated packages, these can generally be ignored

## Original App

This is a fixed version of the [habits-mobile](https://github.com/cpenniman12/habits-mobile) app.