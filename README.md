
# Jarvis AI

Assistente vocale web con interfaccia futuristica, animazioni reattive e supporto per comandi vocali in italiano.

## Funzionalità

- Interfaccia responsive per computer e smartphone.
- Nucleo centrale animato.
- Riconoscimento vocale tramite le API supportate dal browser.
- Attivazione vocale con «Ehi Jarvis», dove supportata.
- Attivazione tramite due battiti di mani, con microfono autorizzato.
- Sintesi vocale in italiano, dove disponibile.
- Cronologia della conversazione.
- Supporto PWA e risorse per l'utilizzo offline.
- Possibilità di configurare un backend AI tramite endpoint HTTPS.

## Avvio

Apri il sito pubblicato su Vercel e premi **Attiva microfono** per concedere l'autorizzazione.

Per il microfono e le funzionalità vocali è necessario un contesto sicuro HTTPS e il permesso del browser.

## Backend AI

Senza un backend configurato, Jarvis risponde soltanto ad alcuni comandi locali.

Per collegare un backend, apri **Impostazioni** e inserisci un endpoint HTTPS che accetti una richiesta POST JSON nel formato:

`{ "message": "...", "history": [], "lang": "it-IT" }`

Il backend deve restituire una risposta JSON contenente `reply` come stringa. Questo contratto deve essere implementato dal backend.

Non inserire chiavi segrete nel codice frontend.

## Limiti

Il riconoscimento vocale dipende dal browser e può richiedere una connessione a un servizio esterno. L'attivazione vocale non è garantita quando la pagina è chiusa o sospesa.

Le notifiche push non sono ancora configurate.
