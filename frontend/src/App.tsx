import { useState } from "react";
import Auth from "./auth/Auth";
import Tasks from "./pages/Tasks";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  if (!token) {
    return (
      <Auth
        onAuthSuccess={() => {
          setToken(localStorage.getItem("token"));
        }}
      />
    );
  }

  return <Tasks onLogout={() => setToken(null)} />;
}
