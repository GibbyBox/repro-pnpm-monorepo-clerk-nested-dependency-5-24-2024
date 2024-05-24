
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '@/tamagui.config';
import * as SecureStore from 'expo-secure-store';

import "@/css/global-css-imports";
import { ClerkLoaded, ClerkProvider, ClerkProviderProps } from '@clerk/clerk-expo';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const tokenCache: ClerkProviderProps['tokenCache'] = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
  async clearToken(key: string) {
    try {
      SecureStore.deleteItemAsync(key)
    } catch (err) {
      return;
    }
  }
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? 'light';
  if (!process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY) throw new Error('Expected a value for `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` but received none');

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ClerkProvider
          tokenCache={tokenCache}
          publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          <ClerkLoaded>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
          </ClerkLoaded>
        </ClerkProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
