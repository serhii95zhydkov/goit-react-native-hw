import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  collectionGroup,
  updateDoc,
  getDocs,
} from "firebase/firestore";

import { db, storage } from "../../firebase/config";

import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

import {
  authSignOutUser,
  updateUserAvatar,
} from "../../redux/auth/authOperations";

import PostItem from "../../components/PostItem";
import Avatar from "../../components/Avatar";

const ProfileScreen = ({ navigation }) => {
  const [userPosts, setUserPosts] = useState([]);
  const { userId, login, avatar } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserPosts();
  }, []);

  const getUserPosts = async () => {
    const userQuery = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    onSnapshot(userQuery, (data) =>
      setUserPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    );
  };

  const updateUserComments = async (avatar) => {
    const userQuery = query(
      collectionGroup(db, "comments"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(userQuery);
    querySnapshot.forEach((doc) => {
      updateDoc(doc.ref, {
        avatar,
      });
    });
  };

  const uploadPhotoToServer = async (avatar) => {
    let imageRef;

    if (avatar) {
      const res = await fetch(avatar);
      const file = await res.blob();
      const uniqId = Date.now().toString();
      imageRef = ref(storage, `userAvatars/${uniqId}`);
      await uploadBytes(imageRef, file);
    } else {
      imageRef = ref(storage, `userAvatars/avatar_placeholder.jpg`);
    }

    const processedPhoto = await getDownloadURL(imageRef);
    return processedPhoto;
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const photo = await uploadPhotoToServer(result.assets[0].uri);
      await updateUserComments(photo);
      dispatch(updateUserAvatar(photo));
    }
  };

  const removeAvatar = async () => {
    const photo = await uploadPhotoToServer();
    await updateUserComments(photo);
    dispatch(updateUserAvatar(photo));
  };

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.bgImage}
        source={require("../../../assets/images/photo-bg.jpg")}
      >
        <View style={styles.wrapper}>
          <Avatar avatar={avatar} onPick={pickAvatar} onRemove={removeAvatar} />
          <TouchableOpacity
            style={styles.btnRight}
            activeOpacity={0.5}
            onPress={signOut}
          >
            <Feather name="log-out" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          <Text style={styles.title}>{login}</Text>
          {userPosts.length > 0 ? (
            <FlatList
              data={userPosts}
              style={styles.postList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PostItem item={item} navigation={navigation} userId={userId} />
              )}
            />
          ) : (
            <Text style={styles.placeholderText}>
              Тут будуть ваші публікації.
            </Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
  },
  wrapper: {
    flex: 1,
    position: "relative",
    width: "100%",
    marginTop: 147,
    paddingTop: 92,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  btnRight: {
    position: "absolute",
    right: 16,
    top: 22,
  },
  title: {
    marginBottom: 33,
    textAlign: "center",
    fontWeight: "500",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.16,
    color: "#212121",
  },
  postList: {
    marginHorizontal: 16,
    maxWidth: 360,
    marginBottom: 46,
  },
  placeholderText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
});
