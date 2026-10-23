import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/Firebase";
import InicioSesionScreen from "../screens/InicioSesionScreen";
import CrearCuentaScreen from "../screens/CrearCuentaScreen";
import MisViajesScreen from "../screens/MisViajesScreen";
import NuevoViajeScreen from "../screens/NuevoViajeScreen";
import ModificarViajeScreen from "../screens/ModificarViajeScreen";
import CuentaScreen from "../screens/CuentaScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function Pestanas() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1F6F78" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "#FFFFFF" },
        tabBarActiveTintColor: "#1F6F78",
        tabBarInactiveTintColor: "#8D99AE",
      }}
    >
      <Tab.Screen
        name="Mis viajes"
        component={MisViajesScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={[styles.icono, !focused && styles.iconoApagado]}>✈️</Text> }}
      />
      <Tab.Screen
        name="Nuevo"
        component={NuevoViajeScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={[styles.icono, !focused && styles.iconoApagado]}>📍</Text> }}
      />
      <Tab.Screen
        name="Cuenta"
        component={CuentaScreen}
        options={{ tabBarIcon: ({ focused }) => <Text style={[styles.icono, !focused && styles.iconoApagado]}>🙂</Text> }}
      />
    </Tab.Navigator>
  );
}

function Pila() {
  const [usuario, setUsuario] = useState<any>(null);
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    const desuscribir = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual);
      setVerificando(false);
    });
    return desuscribir;
  }, []);

  if (verificando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#1F6F78" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1F6F78" },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      {usuario ? (
        <>
          <Stack.Screen name="Principal" component={Pestanas} options={{ headerShown: false }} />
          <Stack.Screen name="ModificarViaje" component={ModificarViajeScreen} options={{ title: "Modificar viaje" }} />
        </>
      ) : (
        <>
          <Stack.Screen name="InicioSesion" component={InicioSesionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CrearCuenta" component={CrearCuentaScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Pila />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    backgroundColor: "#F4F1EA",
    alignItems: "center",
    justifyContent: "center",
  },
  icono: {
    fontSize: 22,
  },
  iconoApagado: {
    opacity: 0.5,
  },
});
