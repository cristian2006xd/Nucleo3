import { useState } from "react";
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, traducirError } from "../config/Firebase";
import Boton from "../components/Boton";
import Campo from "../components/Campo";

export default function CrearCuentaScreen({ navigation }: any) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errores, setErrores] = useState<any>({});
  const [cargando, setCargando] = useState(false);

  async function crearCuenta() {
    const nuevosErrores: any = {};
    if (correo.trim() === "") nuevosErrores.correo = "Ingresa tu correo";
    if (contrasena === "") nuevosErrores.contrasena = "Ingresa una contraseña";
    else if (contrasena.length < 6) nuevosErrores.contrasena = "Debe tener al menos 6 caracteres";
    if (confirmar === "") nuevosErrores.confirmar = "Confirma tu contraseña";
    else if (confirmar !== contrasena) nuevosErrores.confirmar = "Las contraseñas no coinciden";
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargando(true);
    try {
      await createUserWithEmailAndPassword(auth, correo.trim(), contrasena);
      Alert.alert("Aviso", "Tu cuenta se creó correctamente");
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
          <Text style={styles.logo}>nucleo3</Text>
          <Text style={styles.subtitulo}>Tus viajes y su clima</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.titulo}>Crear cuenta</Text>
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
            placeholder="Mínimo 6 caracteres"
            secureTextEntry={true}
            autoCapitalize="none"
            error={errores.contrasena}
          />
          <Campo
            etiqueta="Confirmar contraseña"
            valor={confirmar}
            onChangeText={setConfirmar}
            placeholder="Repite tu contraseña"
            secureTextEntry={true}
            autoCapitalize="none"
            error={errores.confirmar}
          />
          <Boton titulo="Crear cuenta" onPress={crearCuenta} cargando={cargando} />
          <TouchableOpacity onPress={() => navigation.popTo("InicioSesion")}>
            <Text style={styles.enlace}>Ya tengo cuenta</Text>
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
