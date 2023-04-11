import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

import { FontAwesome, Feather } from "@expo/vector-icons";

import * as Location from "expo-location";

import { storage, db } from "../../firebase/config";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

import ErrorMessage from "../../components/ErrorMessage";

const CreatePostsScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [camera, setCamera] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [error, setError] = useState(null);

  const { login, userId } = useSelector((state) => state.auth);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  const changeType = () => {
    setType(type === CameraType.back ? CameraType.front : CameraType.back);
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Немає доступу до камери</Text>;
  }

  const uploadPhotoToServer = async () => {
    const res = await fetch(photo);
    const file = await res.blob();
    const uniquePostId = Date.now().toString();
    const imageRef = ref(storage, `postImages/${uniquePostId}`);
    await uploadBytes(imageRef, file);
    const processedPhoto = await getDownloadURL(imageRef);
    return processedPhoto;
  };

  const takePhoto = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      const { coords } = await Location.getCurrentPositionAsync();
      await MediaLibrary.createAssetAsync(uri);
      setCoords(coords);
      setPhoto(uri);
    }
  };

  const sendPhoto = async () => {
    if (!photo || !title || !location) {
      setError("Будь ласка, заповніть всі поля!");
      return;
    }
    uploadPostToServer();
    navigation.navigate("Home");
  };

  const uploadPostToServer = async () => {
    const createdAt = Date.now();
    const photo = await uploadPhotoToServer();

    await addDoc(collection(db, `posts`), {
      photo,
      title,
      location,
      coords,
      login,
      userId,
      createdAt,
      likedBy: [],
    });
  };

  const resetPost = () => {
    setPhoto(null);
    setTitle("");
    setLocation("");
    setCoords(null);
    setError(null);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
          <Camera style={styles.camera} ref={setCamera} type={type}>
            {photo && (
              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: photo }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.photoButton}
              onPress={takePhoto}
              onLongPress={changeType}
            >
              <FontAwesome name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </Camera>
          <Text style={styles.cameraLabel}>
            {photo ? "Редагувати фото" : "Завантажити фото"}
          </Text>
          <View style={{ marginHorizontal: 16 }}>
            <TextInput
              style={styles.titleInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={(value) => setTitle(value)}
              value={title}
              placeholder="Назва..."
              placeholderTextColor="#BDBDBD"
            />
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.locationInput}
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={(value) => setLocation(value)}
                value={location}
                placeholder="Місцевість..."
                placeholderTextColor="#BDBDBD"
              />
              <Feather
                style={styles.locationIcon}
                name="map-pin"
                size={24}
                color="#BDBDBD"
              />
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={{
                ...styles.sendButton,
                backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
              }}
              activeOpacity={0.5}
              onPress={sendPhoto}
            >
              <Text
                style={{
                  ...styles.sendLabel,
                  color: photo ? "#FFFFFF" : "#BDBDBD",
                }}
              >
                Опублікувати
              </Text>
            </TouchableOpacity>
            {error && <ErrorMessage error={error} />}
          </View>
          <View style={{ flex: 1, position: "absolute", top: 580, left: 160 }}>
            <TouchableOpacity
              onPress={resetPost}
              style={{
                ...styles.resetBtn,
                backgroundColor: photo ? "#FF6C00" : "#F6F6F6",
              }}
            >
              <Feather
                name="trash"
                size={24}
                color={photo ? "#FFFFFF" : "#BDBDBD"}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  camera: {
    height: 240,
    marginTop: 32,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#E8E8E8",
  },
  photoWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderColor: "#FFFFFF",
    borderWidth: 1,
  },
  photoButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 50,
  },
  cameraLabel: {
    marginTop: 8,
    marginBottom: 32,
    marginLeft: 16,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    color: "#BDBDBD",
  },
  titleInput: {
    height: 50,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
    color: "#212121",
  },
  locationInput: {
    height: 50,
    paddingLeft: 28,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  locationIcon: {
    position: "absolute",
    top: 13,
  },
  sendButton: {
    height: 51,
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  sendLabel: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
  resetBtn: {
    marginBottom: 10,
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
