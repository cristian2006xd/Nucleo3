import { useState } from "react";
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, traducirError } from "../config/Firebase";
import Boton from "../components/Boton";
import Campo from "../components/Campo";

export default function InicioSesionScreen({ navigation }: any) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errores, setErrores] = useState<any>({});
  const [cargando, setCargando] = useState(false);

  async function ingresar() {
    const nuevosErrores: any = {};
    if (correo.trim() === "") nuevosErrores.correo = "Ingresa tu correo";
    if (contrasena === "") nuevosErrores.contrasena = "Ingresa tu contraseña";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    try {
      await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
    } catch (error: any) {
      Alert.alert("Aviso", traducirError(error.code));
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.contenedor} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.bloque}>
          <Text style={styles.logo}>Agencia de Viajes</Text>
          <Text style={styles.subtitulo}>Tus viajes y su clima</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Iniciar sesión</Text>
          <Campo
            etiqueta="Correo"
            valor={correo}
            onChangeText={setCorreo}
            placeholder="tucorreo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errores.correo}
          />
          <Campo
            etiqueta="Contraseña"
            valor={contrasena}
            onChangeText={setContrasena}
            placeholder="Tu contraseña"
            secureTextEntry={true}
            autoCapitalize="none"
            error={errores.contrasena}
          />
          <Boton titulo="Ingresar" onPress={ingresar} cargando={cargando} />
          <TouchableOpacity onPress={() => navigation.navigate("CrearCuenta")}>
            <Text style={styles.enlace}>Crear una cuenta nueva</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    paddingBottom: 30,
  },
  bloque: {
    height: Dimensions.get("window").height * 0.35,
    backgroundColor: "#1F6F78",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },
  logo: {
    fontSize: 46,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  subtitulo: {
    fontSize: 16,
    color: "#FFFFFF",
    marginTop: 6,
  },
  tarjeta: {
    backgroundColor: "#FFFFFF",
    marginTop: -50,
    marginHorizontal: 22,
    borderRadius: 24,
    padding: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2B2D42",
    marginBottom: 18,
  },
  enlace: {
    textAlign: "center",
    color: "#1F6F78",
    fontWeight: "bold",
    marginTop: 18,
  },
});
