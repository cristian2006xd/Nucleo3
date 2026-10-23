import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import TarjetaViaje from "../components/TarjetaViaje";

export default function MisViajesScreen({ navigation }: any) {
  const [viajes, setViajes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  function escucharViajes() {
    const consulta = query(collection(db, "viajeros", auth.currentUser!.uid, "lugares"), orderBy("creado", "desc"));
    return onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => {
          const datos = documento.data();
          return {
            id: documento.id,
            nombre: datos.nombre,
            ciudad: datos.ciudad,
            pais: datos.pais,
            latitud: datos.latitud,
            longitud: datos.longitud,
          };
        });
        setViajes(lista);
        setError("");
        setCargando(false);
      },
      () => {
        setError("No se pudieron cargar tus viajes. Revisa tu conexión a internet e intenta de nuevo.");
        setCargando(false);
      }
    );
  }

  useEffect(() => {
    const desuscribir = escucharViajes();
    return desuscribir;
  }, []);

  return (
    <View style={styles.contenedor}>
      <View style={styles.encabezado}>
        <Text style={styles.saludo}>Hola,</Text>
        <Text style={styles.correo}>{auth.currentUser?.email}</Text>
        <Text style={styles.cantidad}>
          {viajes.length} {viajes.length === 1 ? "viaje guardado" : "viajes guardados"}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#1F6F78" />
        </View>
      ) : error !== "" ? (
        <View style={styles.centro}>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={viajes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TarjetaViaje viaje={item} onModificar={() => navigation.navigate("ModificarViaje", { viaje: item })} />
          )}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <View style={styles.centro}>
              <Text style={styles.emoji}>🧳</Text>
              <Text style={styles.vacio}>Aún no tienes viajes, agrega el primero en la pestaña Nuevo</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F4F1EA",
  },
  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
  },
  saludo: {
    fontSize: 16,
    color: "#8D99AE",
  },
  correo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2B2D42",
  },
  cantidad: {
    fontSize: 13,
    color: "#1F6F78",
    fontWeight: "600",
    marginTop: 4,
  },
  lista: {
    flexGrow: 1,
    paddingTop: 4,
    paddingBottom: 20,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  emoji: {
    fontSize: 72,
    marginBottom: 12,
  },
  vacio: {
    fontSize: 16,
    color: "#8D99AE",
    textAlign: "center",
  },
  error: {
    fontSize: 16,
    color: "#D1495B",
    textAlign: "center",
    fontWeight: "600",
  },
});
