import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

import { Feather } from "@expo/vector-icons";

import { authSignOutUser } from "../redux/auth/authOperations";

const Header = ({ title, navigation, back }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {title === "Публікації" && (
        <TouchableOpacity
          style={styles.logOut}
          onPress={() => dispatch(authSignOutUser())}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={24} color="#bdbdbd" />
        </TouchableOpacity>
      )}
      {back && (
        <TouchableOpacity
          style={styles.arrowLeft}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="rgba(33, 33, 33, 0.8)" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: 90,
    borderBottomWidth: 1,
    borderColor: "#b3b3b3",
    backgroundColor: "#ffffff",
  },
  title: {
    paddingLeft: "auto",
    paddingRight: "auto",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 17,
    lineHeight: 22,
    color: "#212121",
  },
  logOut: {
    position: "absolute",
    right: 16,
    top: 56,
  },
  arrowLeft: {
    position: "absolute",
    left: 16,
    top: 56,
  },
});
