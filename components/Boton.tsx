import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Boton(props: any) {
  const variante = props.variante || "principal";
  const bloqueado = props.cargando || props.deshabilitado;
  const colorFondo = variante === "peligro" ? styles.peligro : variante === "secundario" ? styles.secundario : styles.principal;

  return (
    <TouchableOpacity
      style={[styles.boton, colorFondo, bloqueado && styles.bloqueado]}
      onPress={props.onPress}
      disabled={bloqueado}
      activeOpacity={0.8}
    >
      {props.cargando ? (
        <ActivityIndicator color={variante === "secundario" ? "#1F6F78" : "#FFFFFF"} />
      ) : (
        <Text style={[styles.texto, variante === "secundario" && styles.textoSecundario]}>{props.titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 46,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  principal: {
    backgroundColor: "#1F6F78",
  },
  secundario: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#1F6F78",
  },
  peligro: {
    backgroundColor: "#D1495B",
  },
  bloqueado: {
    opacity: 0.6,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  textoSecundario: {
    color: "#1F6F78",
  },
});
