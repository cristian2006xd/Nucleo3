import { StyleSheet, Text, TextInput, View } from "react-native";

export default function Campo(props: any) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{props.etiqueta}</Text>
      <TextInput
        style={[styles.input, props.error ? styles.inputError : null]}
        value={props.valor}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor="#8D99AE"
        keyboardType={props.keyboardType}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize={props.autoCapitalize}
      />
      {props.error ? <Text style={styles.error}>{props.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 14,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2B2D42",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F4F1EA",
    borderWidth: 1.5,
    borderColor: "#E4DED2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#2B2D42",
  },
  inputError: {
    borderColor: "#D1495B",
  },
  error: {
    color: "#D1495B",
    fontSize: 12,
    marginTop: 4,
  },
});
