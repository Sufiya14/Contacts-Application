/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { createDrawerNavigator } from '@react-navigation/drawer';
import Contactlist from './components/Contactlist';
import Favorite from './components/Favorite';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Newcontact from './components/Newcontact';
import Updatecontact from './components/Updatecontact';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName='Contactlist' screenOptions={{
       drawerStyle: {
        backgroundColor: '#c6cbef',
        width: 240,
      },
      }}>
      <Drawer.Screen name="Contactlist" component={Contactlist} />
      <Drawer.Screen name="Favorite" component={Favorite} />
    </Drawer.Navigator>
  );

}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='MyDrawer' >
        <Stack.Screen name="MyDrawer" component={MyDrawer} options={{ headerShown: false }}/>
        <Stack.Screen name="Newcontact" component={Newcontact} />
        <Stack.Screen name="Updatecontact" component={Updatecontact} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

