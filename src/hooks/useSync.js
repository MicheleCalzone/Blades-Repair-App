import { useEffect } from "react";
import { syncNow } from "../services/syncService";

export const useSync = () => {
    useEffect(() => {
        // tenta subito la sync
        syncNow();

        // quando torni online
        const handler = () => syncNow();
        window.addEventListener("online", handler);

        return () => {
            window.removeEventListener("online", handler);
        };
    }, []);
};
