import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/Firebase";
import Boton from "../components/Boton";
import Campo from "../components/Campo";

export default function ModificarViajeScreen({ route, navigation }: any) {
  const viaje = route.params.viaje;
  const [nombre, setNombre] = useState(viaje.nombre);
  const [ciudad, setCiudad] = useState(viaje.ciudad);
  const [pais, setPais] = useState(viaje.pais);
  const [latitud, setLatitud] = useState(String(viaje.latitud));
  const [longitud, setLongitud] = useState(String(viaje.longitud));
  const [errores, setErrores] = useState<any>({});
  const [cargando, setCargando] = useState(false);

  async function actualizarViaje() {
    const lat = Number(latitud.replace(",", "."));
    const lon = Number(longitud.replace(",", "."));
    const nuevosErrores: any = {};
    if (nombre.trim() === "") nuevosErrores.nombre = "Ingresa el nombre del viaje";
    if (ciudad.trim() === "") nuevosErrores.ciudad = "Ingresa la ciudad";
    if (pais.trim() === "") nuevosErrores.pais = "Ingresa el país";
    if (latitud.trim() === "") nuevosErrores.latitud = "Ingresa la latitud";
    else if (isNaN(lat) || lat < -90 || lat > 90) nuevosErrores.latitud = "Debe estar entre -90 y 90";
    if (longitud.trim() === "") nuevosErrores.longitud = "Ingresa la longitud";
    else if (isNaN(lon) || lon < -180 || lon > 180) nuevosErrores.longitud = "Debe estar entre -180 y 180";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    try {
      await updateDoc(doc(db, "viajeros", auth.currentUser!.uid, "lugares", viaje.id), {
        nombre: nombre.trim(),
        ciudad: ciudad.trim(),
        pais: pais.trim(),
        latitud: lat,
        longitud: lon,
      });
      Alert.alert("Aviso", "Viaje actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Aviso", "No se pudo actualizar el viaje, revisa tu conexión a internet");
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Editar destino</Text>
          <Text style={styles.subtitulo}>Cambia los datos y guarda los cambios</Text>
          <Campo
            etiqueta="Nombre del viaje"
            valor={nombre}
            onChangeText={setNombre}
            placeholder="Vacaciones de verano"
            error={errores.nombre}
          />
          <Campo etiqueta="Ciudad" valor={ciudad} onChangeText={setCiudad} placeholder="Quito" error={errores.ciudad} />
          <Campo etiqueta="País" valor={pais} onChangeText={setPais} placeholder="Ecuador" error={errores.pais} />
          <View style={styles.fila}>
            <View style={styles.columna}>
              <Campo
                etiqueta="Latitud"
                valor={latitud}
                onChangeText={setLatitud}
                placeholder="-0.18"
                keyboardType="numeric"
                error={errores.latitud}
              />
            </View>
            <View style={styles.columna}>
              <Campo
                etiqueta="Longitud"
                valor={longitud}
                onChangeText={setLongitud}
                placeholder="-78.47"
                keyboardType="numeric"
                error={errores.longitud}
              />
            </View>
          </View>
          <Boton titulo="Guardar cambios" onPress={actualizarViaje} cargando={cargando} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#F4F1EA",
  },
  scroll: {
    padding: 16,
    paddingBottom: 30,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B2D42",
  },
  subtitulo: {
    fontSize: 14,
    color: "#8D99AE",
    marginTop: 4,
    marginBottom: 18,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
  },
  columna: {
    flex: 1,
  },
});
