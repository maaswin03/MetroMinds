import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const expires = localStorage.getItem("expires");
    const name = localStorage.getItem("name")

    if (email && expires && name) {
      const expirationDate = new Date(expires);
      const currentDate = new Date();

      if (currentDate < expirationDate) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("expires");
        localStorage.removeItem("name");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return { isAuthenticated, setIsAuthenticated };
}
