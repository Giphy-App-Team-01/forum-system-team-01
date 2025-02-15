import { createContext } from "react";

export const AppContext = createContext({
  authUser: null,  // Данни от Firebase Authentication
  dbUser: null,    // Данни от Firestore Database
  loading: true,   // Флаг за зареждане на потребителските данни
  setAppState: () => {}, // Функция за актуализиране на състоянието
});