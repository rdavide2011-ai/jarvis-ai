# Jarvis AI — push PWA (fix VAPID)

Nessun segreto reale in questo pacchetto. Struttura (tutto nella root del repo, tranne `supabase/` e `tools/`):
`index.html`, `service-worker.js`, `manifest.webmanifest`, `vercel.json`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `supabase/`, `tools/`.

## Idea della correzione
La chiave pubblica NON è più scritta nell'HTML: il frontend la legge da `GET ?action=status` della funzione, che la prende dai Secrets e verifica che derivi dalla privata. Così una chiave "vecchia" nell'HTML o una coppia sbagliata nei Secrets diventano impossibili o visibili a schermo.

## 1 · Chiavi VAPID (una sola coppia, in locale)
    npx web-push generate-vapid-keys
Tieni i valori nel terminale. Verifica la coppia (senza incollarla in chat):
    VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." node tools/check-vapid.mjs
Deve stampare `OK: la coppia è coerente`.

## 2 · Secrets Supabase (progetto razumirsnqxmakbpdldi)
Dashboard → Edge Functions → Secrets, oppure:
    supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..." VAPID_SUBJECT="mailto:TUA-EMAIL-REALE" JARVIS_TEST_TOKEN="stringa-casuale-di-almeno-16-caratteri" --project-ref razumirsnqxmakbpdldi
Niente virgolette/spazi dentro i valori salvati. `VAPID_SUBJECT` deve essere un'email reale (non example.com).

## 3 · Deploy della funzione
    supabase functions deploy jarvis-push-test --project-ref razumirsnqxmakbpdldi --no-verify-jwt
Controllo: apri nel browser
`https://razumirsnqxmakbpdldi.supabase.co/functions/v1/jarvis-push-test?action=status`
Atteso: `"pairMatches": true`, `"subjectValid": true`, `"tokenConfigured": true`, `"publicKeyBytes": 65`.
(Se il browser mostra errore di origin, usa `curl`; la risposta è la stessa.)

## 4 · Vercel
1. Project → Settings → General: Root Directory vuota (root repo); Framework Preset **Other**.
2. Build & Development Settings: disattiva gli override di **Build Command** e **Output Directory** (l'errore `STATIC_BUILD_NO_OUT_DIR` nasce da un Build Command che cerca la cartella `public`).
3. Carica i file su GitHub (branch `main`), attendi il deploy.
4. Controlla: `/service-worker.js` mostra JavaScript (non HTML), `/manifest.webmanifest` mostra JSON.

## 5 · Test (vedi checklist nel messaggio)
