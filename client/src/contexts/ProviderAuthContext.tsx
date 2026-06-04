import { createContext, useContext, useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "apgp_provider_token";

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
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    try {
      if (t) {
        localStorage.setItem(TOKEN_KEY, t);
      } else {
        localStorage.removeItem(TOKEN_KEY);
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
