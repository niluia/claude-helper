# project_log

Diario di progetto: dove siamo, cosa è stato fatto (e cosa scartato), cosa resta da fare.
Pensato per essere letto e aggiornato sia da persone sia da una sessione di Claude che non conosce la storia del progetto.

## File

| File | Cosa contiene | Come si aggiorna |
|---|---|---|
| `STATO.md` | Stato attuale, breve: il problema, la soluzione/formulazione corrente, dove siamo, prossimo passo | Si **riscrive** quando lo stato cambia |
| `HISTORY.md` | Cronologia dettagliata, una sezione per passo (`## H<n>. Titolo (data) [stato]`) con numeri, tabelle e motivo delle scelte | Si **aggiunge** in fondo; non si cancella, si corregge |
| `note.md` | Solo appunti: da fare, idee in sospeso, regole concordate, percorsi utili | Quando una voce è fatta o abbandonata, l'esito va in `HISTORY.md` |
| `history_tree.html` | Albero interattivo della history (scheda del browser: *Work tree*): ramo centrale = passi accettati, rami laterali = tentativi scartati o superati; clic = dettagli | **Non si modifica**: è generico |
| `history_data.js` | Contenuto dell'albero: una riga per passo, nodi con lo stesso id delle sezioni di `HISTORY.md` | Si aggiorna **insieme** a `HISTORY.md` |

Stati: `acc` accettato · `run` in corso · `pen` in attesa · `dis` scartato · `sup` superato (usato e poi sostituito).

**Leader del progetto** (`leader` in `history_data.js`): chi ha iniziato il progetto. È l'unico che segna un passo come
accettato (`acc`); gli altri, e le sessioni di Claude, propongono e aspettano la sua conferma. I rami in corso (`run`)
hanno il nome di chi sta facendo il test (`who`), mostrato sul ramo.

## Istruzioni per una sessione di Claude

1. All'inizio leggere `STATO.md` (contesto) e `note.md` (regole concordate e cose da fare); `HISTORY.md` solo per i dettagli.
2. Quando parte un test o un tentativo: aggiungere sezione e nodo con stato `run` e `who` = chi lo sta facendo.
3. Ogni passo concluso (accettato, scartato o superato), con l'accordo dell'utente (per `acc`: solo il leader):
   - aggiungere la sezione `H<n>` in fondo a `HISTORY.md`, con data, stato, cosa si è fatto, numeri e motivo della decisione;
   - aggiungere in `history_data.js` il nodo con lo stesso id: `trunk` se accettato, `left`/`right` della riga del passo
     accettato a cui si riferisce se scartato o superato; `d` è un riassunto breve in HTML;
   - se un passo prima accettato viene sostituito, cambiarne lo stato in `sup` in entrambi i file (non cancellarlo);
   - aggiornare `STATO.md` se cambia lo stato attuale e togliere/spuntare la voce in `note.md`.
4. Non mettere in `note.md` cronologia né risultati: vanno in `HISTORY.md`.
5. Controllo: aprire `history_tree.html` nel browser (funziona da disco, senza server).

## Usarlo in un altro progetto

Copiare questa cartella nel nuovo progetto (ad esempio come `project_log/`), compilare `STATO.md` e il titolo in
`history_data.js`. Per farlo trovare alle sessioni di Claude, aggiungere al `CLAUDE.md` del progetto una riga come:

> Diario di progetto in `project_log/` (stato, history, note): leggere `project_log/README.md` e seguirne le istruzioni.
