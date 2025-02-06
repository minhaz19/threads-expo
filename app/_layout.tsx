import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { Link, Slot, Stack, usePathname, useRouter, useSegments } from 'expo-router'
import "../global.css";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { tokenCache } from '@/utils/cache';
import { secureStore } from '@clerk/clerk-expo/secure-store'
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-expo'
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import AuthenticateLayout from './(auth)/(tabs)/_layout';
import PublicLayout from './(public)/_layout';
import { SafeAreaView } from 'react-native-safe-area-context';

const publishableKey = 'pk_test_aG9uZXN0LXJlaW5kZWVyLTg5LmNsZXJrLmFjY291bnRzLmRldiQ'

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

//prevent auto hide splash screen
SplashScreen.preventAutoHideAsync()

const InitialLayout = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    DMSans_400Regular, DMSans_500Medium, DMSans_700Bold
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    if (!isLoaded) return;
    const inTabsGroup = segments[0] === '(auth)';

    if (isSignedIn && !inTabsGroup) {
      console.log(isSignedIn, inTabsGroup, segments, '/(auth)/(tabs)/feed')
      router.replace('/(auth)/(tabs)/feed');
    } else if (!isSignedIn && inTabsGroup) {
      console.log(isSignedIn, inTabsGroup, segments, '/(public)')
      router.replace('/(public)');
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Slot />
  )
}

const RootLayoutNav = () => {
  return (
    <ClerkProvider
      publishableKey={publishableKey}
      tokenCache={tokenCache}
      __experimental_resourceCache={secureStore}
    >
      <ClerkLoaded>
        <InitialLayout />
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default RootLayoutNav;