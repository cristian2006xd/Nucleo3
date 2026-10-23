import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, CLAVE_CLIMA, db } from "../config/Firebase";
import Boton from "./Boton";

export default function TarjetaViaje(props: any) {
  const viaje = props.viaje;
  const [clima, setClima] = useState<any>(null);
  const [cargandoClima, setCargandoClima] = useState(false);
  const [errorClima, setErrorClima] = useState("");
  const [borrando, setBorrando] = useState(false);

  async function consultarClima() {
    setCargandoClima(true);
    setErrorClima("");
    try {
      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(viaje.ciudad)}&appid=${CLAVE_CLIMA}&units=metric&lang=es`
      );
      if (!resp.ok) {
        setClima(null);
        if (resp.status === 404) setErrorClima("Ciudad no encontrada");
        else if (resp.status === 401) setErrorClima("Clave del clima inválida");
        else setErrorClima("Sin conexión, no se pudo obtener el clima");
        return;
      }
      const datos = await resp.json();
      setClima(datos);
    } catch (error) {
      setClima(null);
      setErrorClima("Sin conexión, no se pudo obtener el clima");
    } finally {
      setCargandoClima(false);
    }
  }

  useEffect(() => {
    consultarClima();
  }, [viaje.ciudad]);

  function borrarViaje() {
    Alert.alert("Aviso", `¿Seguro que quieres borrar "${viaje.nombre}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: async () => {
          setBorrando(true);
          try {
            await deleteDoc(doc(db, "viajeros", auth.currentUser!.uid, "lugares", viaje.id));
          } catch (error) {
            Alert.alert("Aviso", "No se pudo borrar el viaje, revisa tu conexión");
          } finally {
            setBorrando(false);
          }
        },
      },
    ]);
  }

  const descripcion = clima ? clima.weather[0].description : "";

  return (
    <View style={styles.tarjeta}>
      <View style={styles.filaSuperior}>
        <View style={styles.info}>
          <Text style={styles.nombre}>{viaje.nombre}</Text>
          <Text style={styles.lugar}>
            {viaje.ciudad}, {viaje.pais}
          </Text>
        </View>
        {cargandoClima ? (
          <ActivityIndicator size="small" color="#1F6F78" />
        ) : clima ? (
          <Text style={styles.temperatura}>{Math.round(clima.main.temp)}°</Text>
        ) : null}
      </View>

      {errorClima !== "" ? (
        <Text style={styles.errorClima}>{errorClima}</Text>
      ) : clima ? (
        <View style={styles.filaMedio}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png` }}
            style={styles.icono}
          />
          <View>
            <Text style={styles.descripcion}>{descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}</Text>
            <Text style={styles.humedad}>💧 {clima.main.humidity}%</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.filaInferior}>
        <Text style={styles.coordenadas}>
          Lat: {viaje.latitud} | Lon: {viaje.longitud}
        </Text>
        <TouchableOpacity onPress={consultarClima} disabled={cargandoClima}>
          <Text style={styles.actualizar}>↻ Actualizar clima</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.botones}>
        <View style={styles.columnaBoton}>
          <Boton titulo="Modificar" variante="secundario" onPress={props.onModificar} deshabilitado={borrando} />
        </View>
        <View style={styles.columnaBoton}>
          <Boton titulo="Borrar" variante="peligro" onPress={borrarViaje} cargando={borrando} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderLeftWidth: 6,
    borderLeftColor: "#F29E4C",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filaSuperior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginRight: 10,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B2D42",
  },
  lugar: {
    fontSize: 14,
    color: "#8D99AE",
    marginTop: 2,
  },
  temperatura: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1F6F78",
  },
  filaMedio: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  icono: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  descripcion: {
    fontSize: 15,
    color: "#2B2D42",
    fontWeight: "600",
  },
  humedad: {
    fontSize: 13,
    color: "#8D99AE",
    marginTop: 2,
  },
  errorClima: {
    color: "#D1495B",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
  },
  filaInferior: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10,
  },
  coordenadas: {
    fontSize: 12,
    color: "#8D99AE",
  },
  actualizar: {
    fontSize: 12,
    color: "#F29E4C",
    fontWeight: "bold",
    paddingVertical: 4,
  },
  botones: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  columnaBoton: {
    flex: 1,
  },
});
