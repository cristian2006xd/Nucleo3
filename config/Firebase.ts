import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtGto_l-mDXYDNvkCVKrFMkpqqQOd3nfw",
  authDomain: "nucleo3-c3f6e.firebaseapp.com",
  projectId: "nucleo3-c3f6e",
  storageBucket: "nucleo3-c3f6e.firebasestorage.app",
  messagingSenderId: "195150158225",
  appId: "1:195150158225:web:14bba83c4e1d1e7108a230",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const CLAVE_CLIMA = "0e787697ee433fb61a373857111af384";

export function traducirError(codigo: string) {
  if (codigo === "auth/invalid-email") return "El correo no tiene un formato válido";
  if (codigo === "auth/email-already-in-use") return "Ese correo ya está registrado";
  if (codigo === "auth/weak-password") return "La contraseña es muy débil, usa al menos 6 caracteres";
  if (codigo === "auth/invalid-credential") return "Correo o contraseña incorrectos";
  if (codigo === "auth/network-request-failed") return "Sin conexión a internet, revisa tu red e intenta de nuevo";
  return "Ocurrió un error inesperado, intenta de nuevo";
}
