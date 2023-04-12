import { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

import { authSignUpUser } from "../../redux/auth/authOperations";

import { storage } from "../../firebase/config";

import Avatar from "../../components/Avatar";
import ErrorMessage from "../../components/ErrorMessage";

const initialState = {
  login: "",
  email: "",
  password: "",
  avatar: null,
};

const RegistrationScreens = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [dimensions, setDimensions] = useState(
    Dimensions.get("window").width - 16 * 2
  );
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [focused, setFocused] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  useEffect(() => {
    const dimensionsSubscription = Dimensions.addEventListener(
      "change",
      ({ window }) => {
        setDimensions(window.width - 16 * 2);
      }
    );

    return () => {
      dimensionsSubscription.remove();
    };
  }, []);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setState((prevState) => ({
        ...prevState,
        avatar: result.assets[0].uri,
      }));
    }
  };

  const removeAvatar = () => {
    setState((prevState) => ({
      ...prevState,
      avatar: null,
    }));
  };

  const uploadPhotoToServer = async () => {
    let imageRef;

    if (state.avatar) {
      const res = await fetch(state.avatar);
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

  const handleSubmit = async () => {
    const photo = await uploadPhotoToServer();
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setIsLoading(true);
    dispatch(authSignUpUser({ ...state, avatar: photo })).finally(() => {
      setIsLoading(false);
    });
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    setFocused("");
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>
      <View style={styles.container}>
        <ImageBackground
          style={styles.image}
          source={require("../../../assets/images/photo-bg.jpg")}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : ""}
          >
            <View
              style={{
                ...styles.containerForm,
                marginBottom: isShowKeyboard ? -120 : 0,
              }}
            >
              <View style={styles.imageContainer}>
                <Avatar
                  avatar={state.avatar}
                  onPick={pickAvatar}
                  onRemove={removeAvatar}
                />
              </View>
              <View style={styles.form}>
                <View>
                  <Text style={styles.title}>Реєстрація</Text>
                </View>
                <View>
                  <TextInput
                    placeholder="Логін"
                    style={{
                      ...styles.input,
                      borderColor: focused === "login" ? "#FF6C00" : "#E8E8E8",
                      backgroundColor:
                        focused === "login" ? "#FFFFFF" : "#F6F6F6",
                    }}
                    value={state.login}
                    onSubmitEditing={keyboardHide}
                    onFocus={() => {
                      setIsShowKeyboard(true);
                      setFocused("login");
                    }}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, login: value }))
                    }
                  />
                  <TextInput
                    placeholder="Адреса електронної пошти"
                    keyboardType="email-address"
                    style={{
                      ...styles.input,
                      borderColor: focused === "email" ? "#FF6C00" : "#E8E8E8",
                      backgroundColor:
                        focused === "email" ? "#FFFFFF" : "#F6F6F6",
                    }}
                    value={state.email}
                    onSubmitEditing={keyboardHide}
                    onFocus={() => {
                      setIsShowKeyboard(true);
                      setFocused("email");
                    }}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, email: value }))
                    }
                  />
                  <View>
                    <TextInput
                      placeholder="Пароль"
                      style={{
                        ...styles.input,
                        borderColor:
                          focused === "password" ? "#FF6C00" : "#E8E8E8",
                        backgroundColor:
                          focused === "password" ? "#FFFFFF" : "#F6F6F6",
                      }}
                      secureTextEntry={isPasswordHidden}
                      value={state.password}
                      onSubmitEditing={keyboardHide}
                      onFocus={() => {
                        setIsShowKeyboard(true);
                        setFocused("password");
                      }}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          password: value,
                        }))
                      }
                    />
                    <Text
                      style={styles.textPassword}
                      onPress={() =>
                        setIsPasswordHidden((prevState) => !prevState)
                      }
                    >
                      {isPasswordHidden ? "Показати" : "Приховати"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btn}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="large" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.btnTitle}>Зареєструватись</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.textNav}>Вже є акаунт? Увійти</Text>
                </TouchableOpacity>
                {error && <ErrorMessage error={error} />}
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  containerForm: {
    paddingTop: 92,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "absolute",
    borderRadius: 16,
    width: "100%",
    paddingTop: 92,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  form: {
    marginHorizontal: 16,
  },
  title: {
    fontFamily: "Roboto-Regular",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
    textAlign: "center",
    marginBottom: 33,
    color: "#212121",
  },
  input: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    height: 50,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#e8e8e8",
    backgroundColor: "#f6f6f6",
    color: "#212121",
  },
  textPassword: {
    position: "absolute",
    top: "48%",
    left: "76%",
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#1b4371",
  },
  btn: {
    alignItems: "center",
    justifyContent: "center",
    height: 51,
    marginTop: 43,
    marginBottom: 16,
    borderRadius: 100,
    backgroundColor: "#ff6c00",
  },
  btnTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#ffffff",
  },
  textNav: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 32,
    color: "#1b4371",
  },
});
