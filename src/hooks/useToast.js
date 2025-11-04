import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  }, []);

  const hideToast = useCallback(() => {
    setToast({ message: "", type: "" });
  }, []);

  return { toast, showToast, hideToast };
}
