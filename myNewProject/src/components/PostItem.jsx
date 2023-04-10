import { useState, useEffect } from "react";

import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import { Feather } from "@expo/vector-icons";

import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";

import { db } from "../firebase/config";

const PostItem = ({ item, navigation, userId }) => {
  const [commentCount, setCommentCount] = useState([]);

  const { photo, title, id, coords, location, likedBy } = item;

  useEffect(() => {
    getCommentCount();
  }, []);

  const getCommentCount = async () => {
    onSnapshot(collection(db, `posts/${id}/comments`), (data) => {
      setCommentCount(data.size);
    });
  };

  const handleLike = async () => {
    const ref = doc(db, `posts/${id}`);
    if (likedBy.includes(userId)) {
      await updateDoc(ref, {
        likedBy: arrayRemove(userId),
      });
    } else {
      await updateDoc(ref, {
        likedBy: arrayUnion(userId),
      });
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Image source={{ uri: photo }} style={styles.img} />
      <Text style={styles.postTitle}>{title}</Text>
      <View style={styles.postInfo}>
        <View style={styles.commentWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CommentsScreen", {
                postId: id,
                photo: photo,
              })
            }
          >
            <Feather
              style={{ marginRight: 8, transform: [{ rotate: "-90deg" }] }}
              name="message-circle"
              size={24}
              color={commentCount > 0 ? "#FF6C00" : "#BDBDBD"}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, lineHeight: 19, color: "#212121" }}>
            {commentCount}
          </Text>
        </View>
        <View style={styles.likeWrapper}>
          <TouchableOpacity onPress={handleLike}>
            <Feather
              style={{ marginRight: 6 }}
              name="thumbs-up"
              size={24}
              color={likedBy.includes(userId) ? "#FF6C00" : "#BDBDBD"}
            />
          </TouchableOpacity>
          <Text style={{ fontSize: 16, lineHeight: 19, color: "#212121" }}>
            {likedBy.length}
          </Text>
        </View>
        <View style={{ marginLeft: "auto" }}>
          <TouchableOpacity
            style={styles.locationBtn}
            onPress={() =>
              navigation.navigate("MapScreen", {
                location: coords,
                title: title,
              })
            }
          >
            <Feather
              style={{ marginRight: 4 }}
              name="map-pin"
              size={24}
              color="#BDBDBD"
            />
            <Text style={styles.locationText}>{location}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  img: {
    height: 240,
    width: "100%",
    marginBottom: 8,
    borderRadius: 8,
  },
  postTitle: {
    marginBottom: 8,
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "left",
    color: "#212121",
  },
  postInfo: {
    flex: 1,
    flexDirection: "row",
  },
  commentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
  },
  likeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
    textDecorationColor: "#212121",
  },
});
