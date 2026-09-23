import { Ionicons } from '@expo/vector-icons';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookingSuccessScreen } from '../screens/BookingSuccessScreen';
import { BrowseRoomsScreen } from '../screens/BrowseRoomsScreen';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoomDetailsScreen } from '../screens/RoomDetailsScreen';
import { colors } from '../theme';
import type { MainTabParamList, RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();

const tabIcons: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Browse: 'grid-outline',
  Bookings: 'calendar-outline',
  Profile: 'person-outline',
};

const tabLabels: Record<keyof MainTabParamList, string> = {
  Browse: 'Khám phá',
  Bookings: 'Lịch của tôi',
  Profile: 'Tài khoản',
};

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.forest,
    background: colors.cream,
    card: colors.white,
    text: colors.ink,
    border: colors.line,
    notification: colors.amber,
  },
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: '#84918B',
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            color={color}
            name={focused ? tabIcons[route.name].replace('-outline', '') as keyof typeof Ionicons.glyphMap : tabIcons[route.name]}
            size={size}
          />
        ),
        tabBarLabel: tabLabels[route.name],
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          marginBottom: 3,
        },
        tabBarStyle: {
          height: 66,
          paddingTop: 7,
          paddingBottom: 6,
          borderTopColor: colors.line,
          backgroundColor: colors.white,
        },
      })}
    >
      <Tabs.Screen component={BrowseRoomsScreen} name="Browse" />
      <Tabs.Screen component={MyBookingsScreen} name="Bookings" />
      <Tabs.Screen component={ProfileScreen} name="Profile" />
    </Tabs.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen component={MainTabs} name="MainTabs" />
        <Stack.Screen component={RoomDetailsScreen} name="RoomDetails" />
        <Stack.Screen
          component={BookingSuccessScreen}
          name="BookingSuccess"
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
