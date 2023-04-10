import { Text, StyleSheet } from "react-native";

const ErrorMessage = ({ error }) => {
  return <Text style={styles.text}>{error}</Text>;
};

export default ErrorMessage;

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    color: "#FF0000",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
});
