import { useState, useContext } from "react";
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
} from "react-native";

import { AuthContext } from "../../../App";

const initialState = {
  email: "",
  password: "",
};

const LoginScreen = ({ navigation }) => {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const { setIsAuth } = useContext(AuthContext);

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
    setState(initialState);
    setIsAuth(true);
  };

  return (
    <TouchableWithoutFeedback onPress={() => keyboardHide()}>
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
              <View style={styles.form}>
                <View>
                  <Text style={styles.title}>Увійти</Text>
                </View>
                <View>
                  <View>
                    <TextInput
                      placeholder="Адреса електронної пошти"
                      style={styles.input}
                      value={state.email}
                      onSubmitEditing={keyboardHide}
                      onFocus={() => {
                        setIsShowKeyboard(true);
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
                      style={styles.input}
                      secureTextEntry={true}
                      value={state.password}
                      onSubmitEditing={keyboardHide}
                      onFocus={() => {
                        setIsShowKeyboard(true);
                      }}
                      onChangeText={(value) =>
                        setState((prevState) => ({
                          ...prevState,
                          password: value,
                        }))
                      }
                    />
                    <Text style={styles.textPassword}>Показати</Text>
                  </View>
                </View>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btn}
                  onPress={keyboardHide}
                >
                  <Text style={styles.btnTitle}>Увійти</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegistrationScreens")}
              >
                <Text style={styles.textNav}>
                  Немає акаунта? Зареєструватися
                </Text>
              </TouchableOpacity>
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
  title: {
    fontFamily: "Roboto-Regular",
    fontSize: 30,
    lineHeight: 35,
    letterSpacing: 0.01,
    textAlign: "center",
    marginBottom: 33,
    color: "#212121",
  },
  containerForm: {
    paddingTop: 32,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#ffffff",
  },
  form: {
    marginHorizontal: 16,
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
    color: "#ffffff",
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
  textNav: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 120,
    color: "#1b4371",
  },
});
