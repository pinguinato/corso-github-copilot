---
description: "Contesto e convenzioni dell'app Bucks2Bar. Use when modificando index.html, script.js o import_random.py nella cartella bucks2bar."
applyTo: "bucks2bar/**"
---

# Bucks2Bar

Bucks2Bar è una web app statica, in italiano, per registrare entrate e uscite mensili e visualizzarle in un grafico a barre. Non ha backend né build: si apre direttamente `index.html` nel browser.

## Struttura

- `index.html`: layout Bootstrap con due tab, **Data** (tabella di input) e **Chart** (grafico).
- `script.js`: stato, rendering della tabella, totali, persistenza e grafico.
- `import_random.py`: script Python da riga di comando che chiede un importo minimo e massimo e genera entrate e uscite casuali per i 12 mesi.

## Stack

- Bootstrap 5.3 e Chart.js 4.4, caricati da CDN. Nessun gestore di pacchetti.
- JavaScript vanilla, senza framework né moduli.

## Modello dati

- Lo stato è `{ income: number[12], expense: number[12] }`, con indice 0 = Gennaio e indice 11 = Dicembre.
- I dati sono salvati in `localStorage` con chiave `bucks2bar-data`.
- Valori negativi o non numerici vengono salvati come `0`.

## Convenzioni

- Testi dell'interfaccia in italiano.
- Importi formattati con `Intl.NumberFormat('it-IT', { currency: 'EUR' })`.
- Colori semantici: verde (`#198754`) per le entrate, rosso (`#dc3545`) per le uscite, sia nella tabella sia nel grafico.
- Il grafico viene creato alla prima apertura del tab **Chart** e poi aggiornato con `chart.update()`, non ricreato.
- Il contenitore del grafico ha `min-height: 400px` e Chart.js usa `maintainAspectRatio: false`.
