# Expo wrapper (WebView)

This minimal Expo app loads the web frontend inside a WebView so you can test the app on a phone using Expo Go.

Setup

1. Install Expo CLI or use `npx`:

```bash
npx expo-cli --version || npm install -g expo-cli
```

2. Edit `app.json` → `expo.extra.WEB_URL` and set it to the URL where your web frontend is accessible (e.g. `http://192.168.1.10:3000` or a public URL).

3. From this folder:

```bash
cd expo-wrapper
npm install
npx expo start
```

4. Open with Expo Go on your phone (scan QR). Ensure the phone can reach the `WEB_URL` (same LAN or public URL).

Notes
- For quick testing you can expose your local web server using `ngrok` and set `WEB_URL` to the `ngrok` URL.
- This wrapper uses a WebView; it is intended for quick QA/testing, not as a replacement for a true React Native port when publishing natively.
