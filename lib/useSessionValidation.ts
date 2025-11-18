import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Hook to validate that the session is still fresh by making a request to the server.
 * This helps catch stale sessions before they cause API failures.
 * 
 * Usage:
 * const { sessionValid, isChecking } = useSessionValidation();
 * 
 * if (!sessionValid) {
 *   // Session is invalid, redirect to login
 * }
 */
export function useSessionValidation() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      // Validate the session is still valid on the server
      // This will trigger a 401 if the session has expired server-side
      const validateSession = async () => {
        try {
          const response = await fetch("/api/auth/session");
          
          if (response.status === 401 || !response.ok) {
            // Session is invalid, next time useSession updates it will redirect
            console.warn("Session validation failed, session may be stale");
          }
        } catch (error) {
          console.error("Failed to validate session:", error);
        }
      };

      // Validate on mount and periodically
      validateSession();
      
      const interval = setInterval(validateSession, 60000); // Every minute
      return () => clearInterval(interval);
    }
  }, [status]);

  return { 
    sessionValid: status === "authenticated", 
    isChecking: status === "loading" 
  };
}
