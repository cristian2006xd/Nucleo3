import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import Boton from "../components/Boton";

export default function CuentaScreen() {
  const correo = auth.currentUser?.email || "";
  const [cantidad, setCantidad] = useState(0);
  const [error, setError] = useState("");

  function escucharViajes() {
    return onSnapshot(
      collection(db, "viajeros", auth.currentUser!.uid, "lugares"),
      (snapshot) => {
        setCantidad(snapshot.size);
        setError("");
      },
      () => {
        setError("No se pudo obtener la cantidad de viajes, revisa tu conexión");
      }
    );
  }

  useEffect(() => {
    const desuscribir = escucharViajes();
    return desuscribir;
  }, []);

  async function salir() {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Aviso", "No se pudo cerrar la sesión, intenta de nuevo");
    }
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <View style={styles.circulo}>
          <Text style={styles.inicial}>{correo.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.correo}>{correo}</Text>

        {error !== "" ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.resumen}>
            <Text style={styles.numero}>{cantidad}</Text>
            <Text style={styles.etiqueta}>{cantidad === 1 ? "viaje guardado" : "viajes guardados"}</Text>
          </View>
        )}

        <View style={styles.boton}>
          <Boton titulo="Cerrar sesión" variante="peligro" onPress={salir} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F4F1EA",
    padding: 20,
    justifyContent: "center",
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  circulo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#1F6F78",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  inicial: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  correo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2D42",
    textAlign: "center",
  },
  resumen: {
    alignItems: "center",
    marginTop: 20,
  },
  numero: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F29E4C",
  },
  etiqueta: {
    fontSize: 14,
    color: "#8D99AE",
  },
  error: {
    fontSize: 14,
    color: "#D1495B",
    textAlign: "center",
    marginTop: 20,
  },
  boton: {
    alignSelf: "stretch",
    marginTop: 24,
  },
});
