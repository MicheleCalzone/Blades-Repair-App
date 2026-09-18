import { useEffect } from "react";
import { syncNow } from "../services/syncService";

export const useSync = (enabled = true) => {
    useEffect(() => {
        if (!enabled) return undefined;

        syncNow();

        const handler = () => syncNow();
        window.addEventListener("online", handler);

        return () => {
            window.removeEventListener("online", handler);
        };
    }, [enabled]);
};
