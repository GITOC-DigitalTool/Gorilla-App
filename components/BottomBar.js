import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Details from '../screens/Details';

const Tab = createBottomTabNavigator();

const BottomBar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Settings" component={Details} />
    </Tab.Navigator>
  );
};

export default BottomBar;
