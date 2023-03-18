import { useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";

const Home = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <Image
          style={styles.img}
          source={require("../../../assets/images/userPhoto.png")}
        />
        <View>
          <Text style={styles.userName}>Natali Romanova</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.photo }} style={styles.postImage} />
            <Text style={styles.postTitle}>{item.title}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("CommentsScreen")}
              >
                <Feather style={styles.buttonComments} name="message-circle" size={24} color="#BDBDBD" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonLocation}
                onPress={() =>
                  navigation.navigate("MapScreen", {
                    location: item.coords,
                    title: item.title,
                  })
                }
              >
                <Feather
                  style={{ marginRight: 4 }}
                  name="map-pin"
                  size={24}
                  color="#BDBDBD"
                />
                <Text style={styles.postLocation}>{item.location}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  img: {
    marginRight: 8,
  },
  userWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 16,
  },
  userName: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: "700",
    color: "#212121",
  },
  userEmail: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "400",
    color: "rgba(33, 33, 33, 0.8)",
  },
  postImage: {
    marginHorizontal: 16,
    marginBottom: 8,
    height: 200,
    borderRadius: 8,
  },
  postTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    textAlign: "left",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 32,
  },
  buttonComments: {
    alignItems: "center",
    flexDirection: "row",
    transform: [{ rotate: '-90deg' }],
  },
  buttonLocation: {
    alignItems: "center",
    flexDirection: "row",
  },
  postLocation: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: "#212121",
  },
});
