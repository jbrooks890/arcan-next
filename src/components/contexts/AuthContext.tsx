import { useContext, createContext, ReactElement } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthContextProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}
