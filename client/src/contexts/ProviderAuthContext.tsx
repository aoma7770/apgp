import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { beginPortalSession, clearPortalSession, getPortalToken, PROVIDER_TOKEN_KEY } from "@/lib/portalSession";

const TOKEN_KEY = PROVIDER_TOKEN_KEY;

interface ProviderAuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const ProviderAuthContext = createContext<ProviderAuthContextType>({
  token: null,
  setToken: () => {},
  clearToken: () => {},
});

export function ProviderAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return getPortalToken("provider");
    } catch {
      return null;
    }
  });

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    try {
      if (t) {
        beginPortalSession("provider", t);
      } else {
        clearPortalSession("provider");
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
  }, []);

  const clearToken = useCallback(() => setToken(null), [setToken]);

  return (
    <ProviderAuthContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </ProviderAuthContext.Provider>
  );
}

export function useProviderAuth() {
  return useContext(ProviderAuthContext);
}

export { TOKEN_KEY };
