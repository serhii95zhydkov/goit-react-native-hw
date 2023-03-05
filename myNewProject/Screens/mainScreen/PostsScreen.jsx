import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const PostsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <Image
          style={styles.img}
          source={require("../../assets/images/userPhoto.png")}
        />
        <View>
          <Text style={styles.userName}>Natali Romanova</Text>
          <Text style={styles.userEmail}>email@example.com</Text>
        </View>
      </View>
    </View>
  );
};
export default PostsScreen;

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
    marginLeft: 16,
    marginTop: 32,
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
});
