import { createStackNavigator } from "@react-navigation/stack";

import { getHeaderTitle } from "@react-navigation/elements";

import Home from "../nestedScreens/Home";
import CommentsScreen from "../nestedScreens/CommentsScreen";
import MapScreen from "../nestedScreens/MapScreen";

import Header from "../../components/Header";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Home"
        component={Home}
        options={{
          headerTitle: "Публікації",
          header: ({ navigation, route, options, back }) => {
            const title = getHeaderTitle(options, route.name);
            return <Header title={title} navigation={navigation} back={back} />;
          },
        }}
      />
      <NestedScreen.Screen
        name="CommentsScreen"
        component={CommentsScreen}
        options={{
          headerTitle: "Коментарі",
          header: ({ navigation, route, options, back }) => {
            const title = getHeaderTitle(options, route.name);
            return <Header title={title} navigation={navigation} back={back} />;
          },
        }}
      />
      <NestedScreen.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          headerTitle: "Мапа",
          header: ({ navigation, route, options, back }) => {
            const title = getHeaderTitle(options, route.name);
            return <Header title={title} navigation={navigation} back={back} />;
          },
        }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
