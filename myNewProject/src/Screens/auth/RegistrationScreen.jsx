import { useState, useContext } from "react";
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
  Image,
} from "react-native";

import { AuthContext } from "../../../App";

const initialState = {
  login: "",
  email: "",
  password: "",
};

const RegistrationScreens = ({ navigation }) => {
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
                marginBottom: isShowKeyboard ? -120 : 0,
              }}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../../assets/images/userBigPhoto.png')} />
                <Image
                  source={require("../../../assets/add.png")}
                  style={styles.iconAdd}
                />
              </View>
              <View style={styles.form}>
                <View>
                  <Text style={styles.title}>Реєстрація</Text>
                </View>
                <View>
                  <TextInput
                    placeholder="Логін"
                    style={styles.input}
                    value={state.login}
                    onSubmitEditing={keyboardHide}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, login: value }))
                    }
                  />
                  <TextInput
                    placeholder="Адреса електронної пошти"
                    style={styles.input}
                    value={state.email}
                    onSubmitEditing={keyboardHide}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={(value) =>
                      setState((prevState) => ({ ...prevState, email: value }))
                    }
                  />
                  <View>
                    <TextInput
                      placeholder="Пароль"
                      style={styles.input}
                      secureTextEntry={true}
                      value={state.password}
                      onSubmitEditing={keyboardHide}
                      onFocus={() => setIsShowKeyboard(true)}
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
                  <Text style={styles.btnTitle}>Зареєструватись</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginScreen")}
                >
                  <Text style={styles.textNav}>Вже є акаунт? Увійти</Text>
                </TouchableOpacity>
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
    paddingTop: 92,
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
    backgroundColor: "#ff6c00",
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
    marginBottom: 32,
    color: "#1b4371",
  },
  imageContainer: {
    position: "absolute",
    left: "35%",
    top: "-15%",
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: "#f6f6f6",
  },
  iconAdd: {
    position: "absolute",
    left: "90%",
    top: "65%",
    width: 25,
    height: 25,
  },
});
