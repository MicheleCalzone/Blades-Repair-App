import { get, set } from "idb-keyval";

const SYNC_KEY = "syncQueue";
const API_SYNC = "https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/report";

// aggiunge un elemento alla coda
export const addToSyncQueue = async (item) => {
    const queue = (await get(SYNC_KEY)) || [];
    queue.push(item);
    await set(SYNC_KEY, queue);
};

// prova a sincronizzare
export const syncNow = async () => {
    if (!navigator.onLine) return;

    const queue = (await get(SYNC_KEY)) || [];
    if (!queue.length) return;

    const remaining = [];

    for (const item of queue) {
        try {
            const res = await fetch(API_SYNC, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });

            if (!res.ok) throw new Error("Errore sync");

            const result = await res.json();
            if (!result.success) throw new Error("Sync rifiutata");

        } catch (err) {
            console.error("Sync fallita, riproverò", err);
            remaining.push(item);
        }
    }

    await set(SYNC_KEY, remaining);
};
