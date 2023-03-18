import React from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Feather } from "@expo/vector-icons";
import { getHeaderTitle } from "@react-navigation/elements";

import RegistrationScreens from "./Screens/auth/RegistrationScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import PostsScreen from "./Screens/mainScreen/PostsScreen";
import CreatePostsScreen from "./Screens/mainScreen/CreatePostsScreen";
import ProfileScreen from "./Screens/mainScreen/ProfileScreen";

import Header from "./components/Header";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <AuthStack.Navigator initialRouteName="LoginScreen">
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="RegistrationScreens"
          component={RegistrationScreens}
        />
        <AuthStack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
      </AuthStack.Navigator>
    );
  }
  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          alignItems: "center",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
        tabBarActiveBackgroundColor: "#ff6c00",
      }}
    >
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarItemStyle: {
            maxWidth: 70,
            height: 40,
            borderRadius: 20,
            alignSelf: "center",
            marginRight: 16,
          },
          tabBarIcon: ({ size, color }) => (
            <Feather name="grid" size={size} color={color} />
          ),
        }}
        name="PostsScreen"
        component={PostsScreen}
      />
      <MainTab.Screen
        options={{
          headerTitle: "Створити публікацію",
          tabBarItemStyle: {
            maxWidth: 70,
            height: 40,
            borderRadius: 20,
            alignSelf: "center",
            marginRight: 16,
          },
          header: ({ route, options, navigation }) => {
            const title = getHeaderTitle(options, route.name);
            const back = {
              title: "Публікації",
            };
            return <Header title={title} navigation={navigation} back={back} />;
          },
          tabBarIcon: ({ size, color }) => (
            <Feather name="plus" size={size} color={color} />
          ),
        }}
        name="CreatePostsScreen"
        component={CreatePostsScreen}
      />
      <MainTab.Screen
        options={{
          headerShown: false,
          tabBarItemStyle: {
            maxWidth: 70,
            height: 40,
            borderRadius: 20,
            alignSelf: "center",
          },
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
    </MainTab.Navigator>
  );
};
