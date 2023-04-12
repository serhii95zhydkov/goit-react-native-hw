import { useState, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { authSignInUser } from "../../redux/auth/authOperations";

import ErrorMessage from "../../components/ErrorMessage";

const initialState = {
  email: "",
  password: "",
};

const LoginScreen = ({ navigation }) => {
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
      dimensionsSubscription?.remove();
    };
  }, []);

  const handleSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setIsLoading(true);
    dispatch(authSignInUser(state)).finally(() => {
      setIsLoading(false);
    });
    setState(initialState);
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
                marginBottom: isShowKeyboard ? -220 : 0,
              }}
            >
              <View style={{ marginHorizontal: 16 }}>
                <View>
                  <Text style={styles.title}>Увійти</Text>
                </View>
                <View>
                  <View>
                    <TextInput
                      placeholder="Адреса електронної пошти"
                      keyboardType="email-address"
                      style={{
                        ...styles.input,
                        borderColor:
                          focused === "email" ? "#FF6C00" : "#E8E8E8",
                        backgroundColor:
                          focused === "email" ? "#FFFFFF" : "#F6F6F6",
                      }}
                      value={state.email}
                      onSubmitEditing={handleSubmit}
                      onFocus={() => {
                        setIsShowKeyboard(true);
                        setFocused("email");
                      }}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          email: value,
                        }))
                      }
                    />
                  </View>
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
                      onSubmitEditing={handleSubmit}
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
                    <Text style={styles.btnTitle}>Увійти</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => navigation.navigate("RegistrationScreens")}
              >
                <Text style={styles.textNav}>
                  Немає акаунта? Зареєструватися
                </Text>
              </TouchableOpacity>
              {error && <ErrorMessage error={error} />}
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;

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
    paddingTop: 32,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff",
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
    backgroundColor: "#FF6C00",
  },
  btnTitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    color: "#FFFFFF",
  },
  textNav: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 120,
    color: "#1b4371",
  },
});
