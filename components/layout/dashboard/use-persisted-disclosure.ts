"use client";

import { useCallback, useSyncExternalStore } from "react";

export function usePersistedDisclosure(key: string, defaultOpen: boolean) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) onStoreChange();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener("tu-media-cms-navigation-change", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(
          "tu-media-cms-navigation-change",
          onStoreChange
        );
      };
    },
    [key]
  );
  const getSnapshot = useCallback(() => {
    const saved = window.localStorage.getItem(key);
    return saved === null ? defaultOpen : saved === "true";
  }, [defaultOpen, key]);
  const open = useSyncExternalStore(
    subscribe,
    getSnapshot,
    useCallback(() => defaultOpen, [defaultOpen])
  );
  const toggle = () => {
    window.localStorage.setItem(key, String(!open));
    window.dispatchEvent(new Event("tu-media-cms-navigation-change"));
  };
  return [open, toggle] as const;
}
