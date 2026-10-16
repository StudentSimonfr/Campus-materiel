import { useContext } from "react";
import { AppContext, type AppState } from "./AppContext";

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans <AppProvider>.");
  return ctx;
}
