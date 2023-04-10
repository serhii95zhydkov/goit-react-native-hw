import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { View, Text, Image, FlatList, StyleSheet } from "react-native";

import { db } from "../../firebase/config";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";

import PostItem from "../../components/PostItem";

const Home = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const { avatar, login, email, userId } = useSelector((state) => state.auth);

  const getAllPosts = async () => {
    const commentsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    onSnapshot(commentsQuery, (data) => {
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <Image style={styles.userImg} source={{ uri: avatar }} />
        <View>
          <Text style={styles.userName}>{login}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>
      </View>
      <FlatList
        data={posts}
        style={styles.postList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem item={item} navigation={navigation} userId={userId} />
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
  userWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 16,
  },
  userImg: {
    marginRight: 8,
    width: 60,
    height: 60,
    borderRadius: 16,
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
  postList: {
    marginHorizontal: 16,
    maxWidth: 360,
  },
});
