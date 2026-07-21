Plan: Debug dettaglio Report Ispezione

Obiettivo
- Individuare e risolvere l'errore che causa la pagina centrale vuota nel dettaglio del report di ispezione (header/footer visibili, contenuto mancante).

Descrizione sintetica
- Aggiungeremo log diagnostici nei punti chiave dell'hook `useInspectionReports` e del componente `InspectionReportNew.jsx` per verificare lo shape dei dati e dove il render si interrompe.
- Se necessario isoleremo componenti che possono generare eccezioni (es. TinyMCE Editor) e applicheremo guardie leggere per evitare crash silenziosi.

Passi dettagliati
1. Raccolta errori e verifiche preliminari
   - Aprire DevTools (Console e Network) e riprodurre il problema cliccando su un report. Annotare eventuali errori JS, warning o richieste fallite.
   - Nota: la request ws://localhost:5173 con 101 Switching Protocols è dovuta a Vite HMR e non è un errore.

2. Aggiungere log diagnostici
   - In `src/hooks/useInspectionReports.js`:
     - Dopo `setReports(normalized)` aggiungere `console.log('inspection reports loaded', normalized.length, normalized)`.
     - Nella catch del fetch aggiungere `console.error('inspection reports load error', err)`.
   - In `src/pages/InspectionReportNew.jsx`:
     - All'inizio del componente (prima del return) aggiungere `console.log('InspectionReportNew render', { id, reportsLength: reports.length, reportToEdit })`.
     - Nell'effetto di hydration aggiungere `console.log('hydration start', report?.id)` e dopo la costruzione dei dati `console.log('hydration done', infoToSet, hydrateBlades)`.
     - Prima di renderizzare il `Editor` loggare `console.log('rendering Editor?', { modalOpen, windowDefined: typeof window !== 'undefined' })`.
   - In `src/pages/InspectionReportList.jsx` aggiungere un log nel click di navigazione: `console.log('navigating to report', r.id)`.

3. Isolamento del possibile componente che causa il crash
   - Temporaneamente rendere il `Editor` condizionale (solo se `typeof window !== 'undefined'`) o sostituirlo con una `textarea` per verificare se è quello a far crashare il render.
   - Se la pagina torna visibile, valutare lazy-loading dell'Editor (import dinamico client-side) o mantenere la condizione di rendering finché non viene inizializzato.

4. Applicare guardie di rendering
   - Proteggere i map su `blades` con `Array.isArray(blades?.A) ? blades.A.map(...) : null` per evitare accessi a undefined.
   - Se `reportToEdit` è null non tentare di accedere a proprietà profonde: mostrare un messaggio "Report non trovato" con link a lista.

5. Test e raccolta output
   - Avviare il dev server (es. `npm run dev`) e seguire la procedura:
     1) Aprire /inspection-reports
     2) Cliccare su una riga per aprire il dettaglio
     3) Copiare l'output della Console (tutti i log aggiunti) e incollarlo qui
   - Se emergono errori di fetch per immagini (id vs URL), valutare di riusare `fetchAndStoreImage` usato per i technical reports.

Edge cases e controlli aggiuntivi
- Id numerico vs stringa: confrontare usando `r.id?.toString() === id` per trovare il report.
- Shape dei dati: i report possono arrivare come `item.items`, `item.points`, `item.blades`; normalizzare nell'hook.
- Foto: possono essere URL, data:, File o id numerici; gestire tutte le forme.
- LocalStorage corrotto: rimuovere o resettare con warning per evitare parse error.

Criteri di successo
- Cliccando su un report nella lista si apre il dettaglio con: campi `info` popolati, hotspots `blades` visibili, e `.photo-preview` mostra immagini se presenti.
- Nessun crash silenzioso (pagina centrale vuota) e nessuna eccezione non gestita in console.

Next steps suggeriti
- Dopo i log, inviare qui l'output console così procedo con la diagnosi puntuale.
- Se il problema è l'Editor, implemento lazy loading e protezioni sul rendering.
- Se le immagini sono solo id, aggiungo `fetchAndStoreImage` nell'hook delle ispezioni per scaricare e cache-are gli URL.

Note
- Il file è salvato senza frontmatter per essere raffinato in seguito.
- Posso applicare i log diagnostici ora (modifiche minime) se vuoi; indicami se preferisci che lo faccia io o incolli tu i log.
