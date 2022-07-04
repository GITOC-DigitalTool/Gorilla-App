import React, { useState, useEffect } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./screens/Home";
import Details from "./screens/Details";
import Verify from "./screens/Verify";
import Search from "./screens/Search";

import { InferenceProvider } from "./utils/InferenceContext";
import { DatasetProvider } from "./utils/DatasetContext";

import { COLORS, SIZES, assets } from "./constants";

import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    backgroundColor: "transparent",
  },
};

const HomeStackScreen = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Home"
  >
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Details" component={Details} />
  </Stack.Navigator>
);

const App = () => {
  return (
    <DatasetProvider>
      <InferenceProvider>
        <NavigationContainer theme={theme}>
          <Tab.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
          >
            <Tab.Screen
              name="Verify"
              component={Verify}
              options={{
                tabBarLabel: "Verify",
                tabBarIcon: ({ size, color }) => (
                  <Ionicons name="checkmark-done" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Home"
              component={HomeStackScreen}
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ size, color }) => (
                  <Ionicons name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Search"
              component={Search}
              options={{
                tabBarLabel: "Search",
                tabBarIcon: ({ size, color }) => (
                  <Ionicons name="search" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </InferenceProvider>
    </DatasetProvider>
  );
};

export default App;
