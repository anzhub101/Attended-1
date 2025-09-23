import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import ProtectedRoute from '@/components/ProtectedRoute';

interface TabIconProps {
  focused: boolean;
  name: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, name, iconName }) => {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Ionicons 
        name={iconName} 
        size={22} 
        color="white"
        style={{ opacity: focused ? 1 : 0.7 }} 
      />
      <Text style={[
        styles.label, 
        { 
          color: 'white', 
          fontWeight: focused ? '600' : '400',
          opacity: focused ? 1 : 0.7
        }
      ]}>
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabel: () => null,
        }}
      >
        
        <Tabs.Screen
          name="schedule"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name="Schedule" iconName="calendar" />
            ),
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name="News" iconName="newspaper" />
            ),
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name="Dashboard" iconName="grid" />
            ),
          }}
        />
        <Tabs.Screen
          name="events"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name="Events" iconName="ticket" />
            ),
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} name="More" iconName="ellipsis-horizontal" />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingTop: 10,
    alignItems: 'center',
    width: 68,
  },
  iconContainerFocused: {
    transform: [{ translateY: -2 }, { scale: 1.05 }],
  },
  label: {
    fontSize: 9,
    textAlign: 'center',
    marginTop: 5,
    color: 'white',
  },
  tabBar: {
    height: 83,
    paddingBottom: 20,
    paddingTop: 9,
    backgroundColor: '#1E2E42',
    borderTopWidth: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});