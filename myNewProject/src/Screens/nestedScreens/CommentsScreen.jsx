import { useState, useEffect } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { useSelector } from "react-redux";

import { db } from "../../firebase/config";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { formatCommentDate } from "../../utils/formatCommentDate";

const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [focused, setFocused] = useState(false);

  const { login, avatar, userId } = useSelector((state) => state.auth);

  const { postId, photo } = route.params;

  useEffect(() => {
    getAllComments();
  }, []);

  const createComment = async () => {
    const date = formatCommentDate(new Date());

    await addDoc(collection(db, `posts/${postId}/comments`), {
      comment,
      login,
      date,
      avatar,
      userId,
    });

    setComment("");
  };

  const getAllComments = async () => {
    const commentsQuery = query(
      collection(db, `posts/${postId}/comments`),
      orderBy("date")
    );

    onSnapshot(commentsQuery, (data) =>
      setAllComments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const keyboardHide = () => {
    setFocused(false);
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <View style={styles.photoWrapper}>
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
        <SafeAreaView style={{ flex: 1, marginHorizontal: 16 }}>
          <FlatList
            data={allComments}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: item.userId === userId ? "row-reverse" : "row",
                }}
              >
                <Image
                  style={{
                    ...styles.messageAvatar,
                    marginLeft: item.userId === userId ? 16 : 0,
                    marginRight: item.userId !== userId ? 16 : 0,
                  }}
                  source={{ uri: item.avatar }}
                />
                <View style={styles.message}>
                  <Text style={styles.messageText}>{item.comment}</Text>
                  <Text style={styles.messageDate}>{item.date}</Text>
                </View>
              </View>
            )}
          />
        </SafeAreaView>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={{ ...styles.form, marginBottom: focused ? 100 : 0 }}>
            <TextInput
              style={{
                ...styles.input,
                borderColor: focused ? "#FF6C00" : "#E8E8E8",
                backgroundColor: focused ? "#FFFFFF" : "#F6F6F6",
              }}
              onFocus={() => {
                setFocused(true);
              }}
              onSubmitEditing={keyboardHide}
              placeholder="Коментувати..."
              placeholderTextColor="#BDBDBD"
              onChangeText={(value) => setComment(value)}
              value={comment}
            />
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={0.5}
              onPress={createComment}
            >
              <AntDesign name="arrowup" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  photoWrapper: {
    height: 240,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  message: {
    flex: 1,
    padding: 16,
    marginBottom: 24,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
  messageText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
  },
  messageDate: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
    color: "#BDBDBD",
  },
  form: {
    position: "relative",
    height: 50,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 50,
  },
  input: {
    height: 50,
    paddingRight: 16,
    paddingLeft: 16,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    borderWidth: 1,
    borderRadius: 50,
    color: "#212121",
  },
  btn: {
    position: "absolute",
    top: 8,
    right: 8,
    justifyContent: "center",
    alignItems: "center",
    width: 34,
    height: 34,
    borderRadius: 100,
    backgroundColor: "#FF6C00",
  },
});
