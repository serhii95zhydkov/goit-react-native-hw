import { useState, useEffect } from "react";

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

const initialState = {
  title: "",
  location: "",
  photo: "",
};

const CreatePostsScreen = ({ navigation }) => {
  const [state, setState] = useState({ ...initialState });
  const [camera, setCamera] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();
      await Location.requestForegroundPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>Немає доступу до камери</Text>;
  }

  const takePhoto = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync();
      await MediaLibrary.createAssetAsync(uri);
      setState((prevState) => ({
        ...prevState,
        photo: uri,
      }));
    }
  };

  const sendPhoto = async () => {
    const { coords } = await Location.getCurrentPositionAsync();
    navigation.navigate("Home", { ...state, coords });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="position">
          <Camera style={styles.camera} ref={setCamera} type={CameraType.back}>
            {state.photo && (
              <View style={styles.photoWrapper}>
                <Image
                  source={{ uri: state.photo }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            )}
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <FontAwesome name="camera" size={24} color="#BDBDBD" />
            </TouchableOpacity>
          </Camera>
          <Text style={styles.cameraLabel}>
            {state.photo ? "Редагувати фото" : "Завантажити фото"}
          </Text>
          <View style={{ marginHorizontal: 16 }}>
            <TextInput
              style={styles.titleInput}
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={(value) =>
                setState((prevState) => ({
                  ...prevState,
                  title: value,
                }))
              }
              value={state.title}
              placeholder="Назва..."
              placeholderTextColor="#BDBDBD"
            />
            <View style={{ position: "relative" }}>
              <TextInput
                style={styles.locationInput}
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={(value) =>
                  setState((prevState) => ({
                    ...prevState,
                    location: value,
                  }))
                }
                value={state.location}
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
                backgroundColor: state.photo ? "#FF6C00" : "#F6F6F6",
              }}
              activeOpacity={0.6}
              onPress={sendPhoto}
            >
              <Text
                style={{
                  ...styles.sendLabel,
                  color: state.photo ? "#FFFFFF" : "#BDBDBD",
                }}
              >
                Опублікувати
              </Text>
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
  photoWrapper: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderColor: "#fff",
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
  titleInput: {
    height: 50,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
    color: "#212121",
    borderBottomColor: "#E8E8E8",
    borderBottomWidth: 1,
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
});
