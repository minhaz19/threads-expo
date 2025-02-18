import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { Slot, useRouter, useSegments } from 'expo-router'
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
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Toast from 'react-native-toast-message';

const publishableKey = 'pk_test_aG9uZXN0LXJlaW5kZWVyLTg5LmNsZXJrLmFjY291bnRzLmRldiQ'

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

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
      router.replace('/(auth)/(tabs)/feed');
    } else if (!isSignedIn && inTabsGroup) {
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
        <ConvexProvider client={convex}>
          <InitialLayout />
        </ConvexProvider>
      </ClerkLoaded>
      <Toast />
      <StatusBar
        animated={true}
        barStyle="dark-content"
        showHideTransition="slide"
        hidden={false}
      />
    </ClerkProvider>

  );
};

export default RootLayoutNav;