<!--
  project_log/HISTORY.md: detailed chronology of everything done, append-only (correct, never delete).
  One section per step, '## H<n>. Title (dd/mm/yyyy) [status]', sub-steps '### H<n><letter>. ...';
  status: [accettato] (only the project leader) | [in corso] | [in attesa] | [scartato] | [superato]. Every section has a node with the same id in
  history_data.js (the interactive tree history_tree.html): update both together. Conventions of the folder: README.md.
-->
# History

Cronologia dettagliata di quello che è stato fatto, provato, accettato o scartato. Ogni sezione corrisponde a un ramo
dell'albero in `history_tree.html` (stesso titolo e stesso numero). Lo stato attuale è in `STATO.md`, le cose ancora da
fare in `note.md`.

Legenda: **[accettato]** entra nel ramo principale; **[scartato]** provato o valutato e abbandonato; **[superato]** usato
per un periodo e poi sostituito; **[in corso]** in esecuzione (con chi lo sta facendo). Solo il leader del progetto
(Andrea Gasparin) segna un passo come accettato.

---

## H1. Punto di partenza: paper e codice (28/10/2026) [accettato]

- Lavoro descritto in `Work_Load_Balancing.pdf`: assegnamento di ordini a fabbriche e bucket settimanali, obiettivo
  carico (quadratico approssimato a gradini, con binarie L^h / z) + ritardo; modello esatto `ExactSolver`
  (`Solvers/solver.py`) e decomposizione divide et impera con selezione random o GAT (`divideEtImperaSolver`, `PairModel`).
- Check paper contro codice. Problemi principali trovati:
  - **Bug in `Solvers/solver.py:163`**: `percentage=float(j)` invece di `float(jj)` (rinomina parziale nel commit be855eb
    del 21/08). Tutti i breakpoint valgono 0 e il vincolo (23) diventa `s ≤ 0`: il modello è infeasible con la domanda
    generata. In `subproblem_solver.py` il codice era corretto.
  - La colonna GAT della Tabella 3 non coincide con `squared.csv`; la colonna Exact non è riproducibile con il codice di oggi.
- Script del ricalcolo della Tabella 3: `table3.py` nello scratchpad della sessione.

## H2. Modello aggregato (job identici come interi) (28/10/2026) [scartato]

- Idea: job con stesso prodotto e stessa due date aggregati in variabili intere n[i,c,t] (2371 classi su 11440 job, 20×24).
- Misure (20×24 run 0, 1 thread):

  | | Base | + ritardo nell'obiettivo, niente indicator | + job aggregati |
  |---|---|---|---|
  | Variabili | 6.4M binarie + penalità | 6.4M binarie | 1.3M intere |
  | Righe | ~6.4M | 19.6k | 10.5k |
  | Costruzione | ~5.7 min | 34 s | 6.6 s |
  | Presolve | 95 s | 68 s | 12 s |
  | RAM | 10 GB | 7 GB | 1.5 GB |

- Stesso bound alla root (~21.3k), il warm start EDD è accettato (76618.75). Con 10 min la ricerca si fermava a 0.147 di
  miglioramento contro 0.668 del modello base; con 16 thread 0.651 a 10 min.
- Variante con `MIPFocus=1` proposta e non fatta (già valutata dagli autori).
- **Decisione: mai aggregare i job.** Resta solo la parte "ritardo nell'obiettivo, niente indicator" (H5).

## H3. Approssimazione del carico: da gradini a PLA (28/10/2026) [accettato]

- I gradini (binarie L^h / z, 9 per risorsa critica e periodo) sostituiti dalla **PLA** (secanti di s² tra breakpoint
  consecutivi), con segmenti continui e senza binarie: le pendenze sono crescenti, quindi i segmenti si riempiono in ordine.
- Breakpoint ρ = {0, 0.01, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1}; pendenza del segmento h = ρ_{h−1} + ρ_h.
- s² ≤ PLA ≤ gradini: esatta nei breakpoint. Cambia la funzione obiettivo, quindi i valori non sono confrontabili con la
  Tabella 3 senza rivalutazione.
- Funzioni in un solo posto: `Instance/factory.py` (`PLA_BREAKPOINTS`, `pla_value`, `pla_slopes`, `pla_widths`).
- L'obiettivo a gradini (`'piecewise'`) è stato rimosso: per riprodurre la Tabella 3 originale serve il codice in git.

### H3b. Tangenti (approssimazione inferiore) [scartato]

- Idea in `note.md`: q ≥ 2·a_h·s − a_h², tangenti a s² nei breakpoint, approssimazione inferiore convessa.
- Superata dalla PLA (approssimazione superiore, esatta nei breakpoint), adottata ovunque.

## H4. Obiettivo: pesi, normalizzazione, obiettivo normalizzato (28/10/2026)

### H4a. Peso per job sul ritardo [superato]

- `Order.weight`, prima discreto {0.1, …, 1.0}, poi U(0, 1]; costo = coefficiente · peso · ritardo.
- Sostituito dal ritardo massimo D_j (H4c).

### H4b. Normalizzazione sulla soluzione EDD [superato]

- obj = α·QL/QL_EDD + (1 − α)·JD/JD_EDD, con QL_EDD e JD_EDD calcolati sulla soluzione EDD (quello che farebbe il
  cliente a mano). Verificata sull'istanza 3×8 (EDD = 1.000).
- Un solo parametro α, β = 1 − α (questa scelta resta).
- Sostituita dall'obiettivo normalizzato sui casi peggiori (H4c).

### H4c. Obiettivo normalizzato [accettato]

obj = α · media su (risorsa critica, bucket) di PLA(u²) + (1 − α) · media sugli ordini di PLA((d_j / D_j)²)

- u = |y − w| / (c − w) nel periodo regolare, (y − w)^+ / (c − w) nel buffer: vale 1 a carico pieno e a y = 0.6c.
- D_j = ritardo massimo dell'ordine, uniforme su {1, 2, 3, 4} (`max_delay_values`).
- Stessi breakpoint per i due termini (per il ritardo ρ_h · D_j); oltre 1 l'ultimo segmento prosegue con pendenza 1.8.
- Medie su #risorse critiche · |T| (buffer compreso) e su |J|: i due termini valgono 1 nel caso peggiore.
  Scelta la media per (risorsa, bucket) e non la somma sui bucket, perché così α ha lo stesso significato su orizzonti di
  lunghezza diversa.
- Costanti fissate alla creazione dell'istanza: `instance.load_coefficient()`, `instance.delay_coefficient()`.
- Verifica 3×8: f_EDD 0.4101 = rivalutazione = warm start Gurobi; MIP 0.0080 = `assign_solution` = rivalutazione.

## H5. Decomposizione e GAT messe da parte (28/10/2026) [scartato]

- Con il nuovo obiettivo `Factory.split`, `PairModel` e `divideEtImperaSolver` non sono stati allineati: i metodi random e
  GAT vanno in errore. La GAT era addestrata con l'obiettivo a gradini (da riaddestrare).
- Bug mai corretto in `divideEtImperaSolver.py:134` (`number_to_optimize` senza limiti, mask aggiornato ma non usato).
- Decisione: "per ora dimentichiamo la decomposizione". Nel branch `test` (30/10) il collega ha rimosso GAT,
  decomposizione e `ExactSolver` dal repo (spostati in `Solvers_old/`, non tracciato).

## H6. Nuovo modello `Model` (`Solvers/model.py`) (28/10/2026) [accettato]

- Formulazione esatta senza aggregazione (dettagli in `STATO.md`):
  - costo di ritardo precalcolato come coefficiente di x: spariscono variabili di ritardo e vincoli `'B'` (~6M righe su 20×24);
  - buffer: solo `s ≥ y − w` (niente binaria b, big-M, indicator); carico come espressione lineare di x;
  - segmenti PLA continui, l'ultimo illimitato.
- `TIME_LIMIT` comprende la costruzione del modello. Commit c06a82e.
- Test 20×24 run 0, 16 thread, 10 min totali: `Model` 0.567 di miglioramento su EDD (gap 1.8%), modello vecchio 0.000
  (costruzione 5.6 min, root LP non finita).

## H7. Metodo per l'LP (28/10/2026)

### H7a. Simplesso duale (`Method=1`) per l'LP [accettato]

- LP rilassato risolto a parte, 16 thread: il simplesso duale è il più veloce.

  | Caso | LP (s) |
  |---|---|
  | 20×24 | 96 |
  | 15×48 | 164 |
  | 20×48 | 310 |

- La soluzione LP è quasi intera (99.98% delle binarie intere).
- Dentro il MIP, però, `Method=1` rallenta la root (452 s su 20×24; prima soluzione a 599 s contro 294 s col default).
  Per il MIP si è poi tornati al Method di default (H13).

### H7b. PDHG [scartato]

- Non converge in 900 s sui casi provati. Non usato.

## H8. Euristiche basate sull'LP (relax and fix) (29/10/2026)

### H8a. V1: fissaggio a 0 con probabilità 1 − LP [scartato]

- Ogni binaria fissata a 0 con probabilità 1 − LP; se un job resta senza posizioni si libera quella con LP più alto.
- Sempre infeasible: l'LP è intero al 99.98%, quindi resta circa una posizione per ordine e le capacità saltano.

### H8b. V2: fissaggio deterministico — "v1" nei confronti [superato]

1. LP con `Method=1`.
2. Per ogni job Max_lp_j e la coppia (i*, t*) che lo realizza; job in ordine decrescente di Max_lp_j.
3. x_{i*,j,t*} = 1 se il carico dei job fissati su tutte le risorse di i* in t* resta ≤ 95% della capacità.
4. MIP ristretto scritto direttamente in forma ridotta (solo gli ordini liberi, niente presolve) nel tempo rimanente.

| Caso | LP (s) | job fissati | obj | migl. su EDD | bound LP | gap su bound LP | tempo |
|---|---|---|---|---|---|---|---|
| 20×24 | 96 | 11208/11440 | 0.16248 | 0.561 | 0.15748 | 3.1% | 146 s |
| 15×48 | 164 | 16522/16845 | 0.18518 | 0.532 | 0.18126 | 2.1% | 295 s |
| 20×48 | 310 | 21533/22000 | 0.13195 | 0.668 | 0.12676 | 3.9% | 553 s |

Confronto (miglioramento su EDD, run 0, 16 thread): 20×24 modello vecchio 0.000 in 10 min, `Model` 0.567 in 10 min,
V2 0.561 in 2.4 min; 20×48 `Model` 0.671 in 60 min (prima soluzione a 39 min), V2 0.668 in 9.2 min.
Grafico: `presolve_tests/confronto_v2_run0.png`.

### H8c. V3: fissaggio probabilistico iterato — "v2" nei confronti [superato]

- Job fissato con probabilità Max_lp_j, nella posizione (i, t) estratta con probabilità x_{i,j,t}^LP (somma 1 su (i, t)),
  stesso controllo di capacità al 95%; MIP ristretto; fino a 10 iterazioni o al tempo limite, si tiene la migliore.
- L'LP si risolve una volta sola.
- Script: `heur.py` nello scratchpad.

## H9. Campagna di validazione (29/10/2026) [accettato]

- 10×24, 15×48, 20×24 (fabbriche multiple di 5), 5 run, 20 min totali, 16 thread, `Method=1` anche per `Model`.
- Gap medio rispetto al miglior bound trovato dai tre metodi:

  | Istanza | v1 (V2) | v2 (V3) | `Model` + EDD |
  |---|---|---|---|
  | 10×24 | 5.72% | 4.76% | 0.59% |
  | 15×48 | 6.61% | 6.07% | 79% (resta EDD) |
  | 20×24 | 8.50% | 7.71% | 3.74% |

- Script per il collega: `test_new.py` (commit c06a82e), stesse istanze (seed `41 + run²`).

## H10. Euristiche del collega (29/10/2026)

Commit f471ec7 (Alex Dagri): `Solvers/local_search.py` (LAHC con numba) e `Solvers/decomposedModel.py`
(costruzione, poi blocchi casuali 4 fabbriche × 4 bucket risolti esatti con Gurobi).

### H10a. local_search (v3) e decomposed_model (v4) [accettato]

| Istanza, run | v3 local_search | v4 decomposed_model | v5 decomposed_alt |
|---|---|---|---|
| 10×24 r0 | 1.79% | 0.47% | 0.49% |
| 10×24 r1 | 6.70% | 3.05% | 2.44% |
| 15×48 r0 | 0.66% | 0.56% | 0.57% |
| 20×24 r0 | 1.67% | 1.38% | 1.37% |

(gap sul miglior bound; per confronto `Model` su 10×24 r1: 1.21%). Campagna interrotta su 15×48 r1.
Le euristiche LP (H8) restano come riferimento ma non sono più nel `test_new.py` del collega.

### H10b. decomposed_alt (v5) [scartato]

- Alternanza di blocchi esatti e ricerca locale (`dm_alternate`): simile a v4; rimossa nel branch `test`.

## H11. Certificazione dell'ottimo (30/10/2026)

Obiettivo: dare a Gurobi la migliore incumbent delle euristiche (v4) e accelerare la chiusura del gap.
10×24 run 0, incumbent v4 0.059052, 20 min, un run per variante.

| variante | bound finale | gap finale | tempo a gap ≤ 0.6% | nodi |
|---|---|---|---|---|
| `Model` (base) | 0.058640 | 0.567% | 470 s | 2728 |
| fissaggio per costi ridotti | 0.058685 | 0.566% | 857 s | 913 |
| fissaggio + taglio sui costi ridotti | 0.058708 | 0.428% | 738 s | 1057 |
| idem + MIPFocus=3, Cuts=2 | 0.058727 | 0.547% | 1021 s | 1 |
| `Model` (base) + MIPFocus=3 | **0.058734** | 0.441% | **203 s** | 1 |

### H11a. Fissaggio per costi ridotti [scartato]

- d = c − Aᵀπ; x fissata a 0 se d > Δ = z_inc − z_LP; bound sicuro per dualità debole (coincide con l'LP a 2e-15).
- Δ = 1.1% dell'incumbent: resta l'80.5% delle binarie, nessun ordine fissato. Teoria: `presolve_tests/reduced_cost_fixing.pdf`.

### H11b. Taglio sui costi ridotti [scartato]

- Σ_L d_k x_k + Σ_U |d_k|(1 − x_k) ≤ Δ. Bound appena più alto (nel rumore di un run), più lento nelle prime fasi.

### H11c. MIPFocus=3 + Cuts=2 [scartato]

- Bound alto ma solo dopo ~1000 s di tagli alla root; l'incumbent non migliora.

### H11d. Rottura delle simmetrie tra ordini identici [scartato]

- 2341 ordini in 1068 classi identiche su 10×24. Scartata: è una caratteristica del generatore, non del problema
  (confronto non equo).

### H11e. `Model` base + MIPFocus=3 [accettato]

- Bound più alto e più rapido (0.058719 già a 203 s, tutto alla root), senza preprocessing; migliora anche l'incumbent.
- Nessuna variante certifica: il gap residuo (~0.4% sul miglior incumbent 0.058960) è di bound.

## H12. Branch `test` del collega e allineamento (30/10/2026) [accettato]

- Commit di Alex Dagri: pulizia (via GAT, decomposizione, `ExactSolver`, notebook, `test.py`), `divisor` → `buffer_buckets`,
  istanze `processing_times: 'per_order'` (casi `10x24_per_order`, `15x48_per_order`), `test_new.py` riscritto
  (results.csv, soluzioni .npz, `--model-start`), README.
- Allineamento fatto da noi:
  - blocchi di `decomposed_model` con la stessa formulazione di `Model` (s, segmenti PLA) al posto di `setPWLObj`;
    verifica 2 min su 10×24 r0: 38 blocchi e obj 0.070283 contro 37 e 0.070437 con la formulazione vecchia;
  - `Model`: parametro `mip_focus`; `run_model` con MIPFocus=3, Method di default, MIPGap 1e-4;
  - `test_new.py`: `--alpha` e `--model-start best` (migliore tra local_search e decomposed_model).

## H13. Campagna su α (30/10/2026) [in corso — Andrea]

- 6 casi (10×24, 10×48, 15×24, 15×48, 20×24, 20×48), run 0, α = 0, 0.1, …, 1; local_search e decomposed_model, poi
  `Model` con warm start dalla migliore; 1 h per metodo (stima ~5.5 giorni). Lanciata il 30/10 alle 17:43, output in
  `results_alpha/` (una cartella per α, avanzamento in `results_alpha/campaign.log`).
- Con α = 0 il problema è banale (la costruzione trova obj 0).
- Completata il 5/11 alle 02:39 (66 combinazioni × 3 metodi, tutte con soluzione valida; i 6 run rilanciati inclusi).
  Tabelle per il collega in `results_alpha/alpha_tables.pdf` (gap sul bound di Gurobi e tempo alla soluzione migliore,
  LS, DM e Gurobi); riepilogo completo in `results_alpha/summary.md`; grafici `results_alpha/alpha_time_gap.png` e
  `alpha_time_improvement.png`.
- Risultati:
  - Gurobi certifica l'ottimo solo in 6 run su 66 (obj = 0 con α = 0 o 1 sui casi piccoli, in 8–3148 s); negli altri 60
    arriva al limite di 1 h (status 9). Gap per α tra 0.1 e 0.9: 0.07–2.7% fino a 20×24, 2.4–6.3% su 20×48 (dove resta al
    nodo radice); agli estremi fino al 77% (20×24, α = 1) e al 100% (20×48, α = 1, bound 0).
  - DM migliore con α ≤ 0.2 e ≥ 0.7, LS con α tra 0.3 e 0.6 (poche eccezioni). LS si ferma da sola in 2–300 s; DM usa
    sempre tutta l'ora.
  - Gli ordini in ritardo crescono regolarmente con α (da ~0% con α = 0 a 54–80% con α = 1).
  - 20×48, α = 0.1: Gurobi riporta 0.037535 ma la soluzione restituita è il warm start del DM, che vale 0.036057. Gurobi non
    ha migliorato il warm start e ne sovrastima il valore, perché non ha mai finito il nodo radice e le variabili continue
    del warm start sono rimaste completate male. Nelle tabelle si usa il valore della soluzione restituita (gap 6.3%
    invece del 10.0%), con una nota.
- Problemi e correzioni in `test_new.py`:
  - 6 run di `model` (obj = 0 con α = 0 o 1 sui casi piccoli) andati in errore per divisione per zero nel gap: ora gap = 0
    quando obj = 0; rilanciati a fine campagna (`rerun_zero.sh` nello scratchpad), tutti riusciti.
  - `check = False` su 2 run (10×48 e 20×24, α = 0.9) per una differenza di 4–7e-6 tra obiettivo di Gurobi e ricalcolo
    (tolleranze di interezza): soluzioni verificate valide; il check ora usa una tolleranza relativa (1e-4).
- Dopo: `Model` senza warm start, per confronto (quando indicato).

## H14. Local search a α = 0: diagnosi (5/11/2026) [in corso — Andrea]

- Dalla campagna su α (H13): a α = 0 LS è molto peggio di DM sui casi grandi (20×24: 0.0274 contro 0.0103; 20×48:
  0.0152 contro 0.0053; anche 15×24 e 15×48). A α = 1 la differenza è solo apparente: obiettivi tutti tra 0.00005 e 0.004
  (EDD 0.57–0.82), il gap sul bound è grande perché anche il bound è vicino a 0; in 3 casi su 6 LS è meglio di DM.
- Struttura delle soluzioni a α = 0: LS satura quasi tutti i bucket (uso medio della risorsa critica 99.9%; 20×24: 479/560
  bucket pieni, 3205 ordini in ritardo) mentre DM e Gurobi lasciano margine (99.0% / 98.5%, 455 e 441 bucket pieni, 1574 e
  1225 in ritardo). Ipotesi: con i bucket pieni il relocate è quasi sempre infeasible e la scelta uniforme dell'ordine
  pesca soprattutto ordini non in ritardo (mosse neutre), finché scatta lo stop per iterazioni senza miglioramento.
- Prove su 20×24 e 20×48, α = 0, solo parametri di configurazione (codice invariato), stop normale per iterazioni senza
  miglioramento (la variante senza stop è stata tolta: LS deve restare veloce): `base`, `cost` (ordine scelto per costo del
  bucket), `group3` (mosse di gruppo, fino a 3 ordini per lato), `wide` (raggio ±6, bucket lontano con prob. 0.5),
  `cost_group3`. Misure: obiettivo, ritardi, tempo e motivo dello stop, iterazioni, miglioramenti, tempo alla migliore,
  obiettivo a 10 s … 60 min. Script e risultati nello scratchpad (`lsdiag/`).
- Risultati (5/11; tutte le varianti si fermano per iterazioni senza miglioramento, soluzioni valide):

  | variante | 20×24 obj | in ritardo | tempo | 20×48 obj | in ritardo | tempo |
  |---|---|---|---|---|---|---|
  | base | 0.027436 | 3205 | 246 s | 0.015161 | 3288 | 304 s |
  | cost | 0.028130 | 3271 | 407 s | 0.014995 | 3271 | 492 s |
  | group3 | 0.028516 | 3296 | 238 s | 0.015187 | 3298 | 420 s |
  | wide | 0.027821 | 3224 | 234 s | 0.015311 | 3303 | 358 s |
  | cost_group3 | 0.027940 | 3257 | 459 s | 0.015759 | 3379 | 578 s |
  | DM (1 h) | 0.010269 | 1574 | | 0.005293 | 1510 | |
  | Gurobi (1 h) | 0.007753 | 1225 | | 0.005258 | 1499 | |

  Nessuna variante dei parametri chiude la distanza da DM (differenze entro ±4%, nel rumore di un run): il limite è
  strutturale. LS anticipa pochissimi ordini (20×24: 127 in anticipo, contro 408 di DM e 924 di Gurobi) e satura i bucket.
- Mossa a catena (ejection chain, copia di LS nello scratchpad, `lschain/`): l'ordine va nel bucket di destinazione e, se
  non ci sta, un ordine di quel bucket viene espulso in un altro, fino a 3 ordini; probabilità 0.3. Con probabilità 0 riproduce
  esattamente LS (0.027436). Risultato a α = 0: 20×24 0.028264, 20×48 0.014964: nessun effetto.
- Causa trovata: con α = 0 spostare un ordine in una fabbrica più lenta non costa nulla, e la ricerca (che accetta le mosse
  neutre) deriva verso assegnamenti inefficienti, che consumano capacità. Lavoro totale sulla risorsa critica rispetto a
  ogni ordine nella sua fabbrica più veloce: 20×24 LS +6.5%, DM +5.6%, Gurobi +4.9%; 20×48 LS +8.9%, DM +4.9%, Gurobi
  +5.5% (ordini nella fabbrica più veloce: LS 57–65%, DM e Gurobi 72–76%). Con α = 0.5 il costo del carico spinge
  all'efficienza e le differenze spariscono (+0.2–0.7%, 97–99% nella fabbrica più veloce).
- Spareggio sul lavoro (copia di LS nello scratchpad, `lschain/local_search_work.py`, `ls_work_mode`): una mossa a costo
  esattamente invariato è accettata solo se non aumenta il tempo di lavorazione sulle risorse critiche; le altre come in
  LAHC. Variante `weight` (LAHC su costo + ε·lavoro, ε 1e-3 / 1e-2 del lavoro minimo): meglio dell'originale ma peggio
  dello spareggio e più lenta, scartata. Con lo spareggio spento riproduce esattamente LS.
  - α = 0: 20×24 0.027436 → **0.010242** in 64 s (DM 0.010269 in 1 h), 20×48 0.015161 → **0.005797** in 52 s (DM 0.005293);
    15×24 0.000760 → 0.000074, 15×48 0.002280 → 0.000029 (meglio di DM). Ordini in ritardo dimezzati.
  - α > 0 (20×24 e 20×48 per α 0.1–1, gli altri casi per 0.5 e 1; un run): variazioni entro ±0.45% (22 meglio, 5 peggio,
    massimo +0.22%), nel rumore; agli estremi meglio (10×48 α = 1 −21%, 20×48 α = 1 −4%). Tempi simili (qualche run più
    lento: 20×48 α = 0.1 182 s contro 81 s).
- 6/11: tenuta su indicazione di Andrea. Spareggio portato in `Solvers/local_search.py` (opzione `ls_work_tie`, default
  attivo; riproduce esattamente la copia nello scratchpad: 20×24 α = 0 0.010242). Rifatta **solo la LS** della campagna su
  α (66 run, `results_alpha/alpha_*`; DM e Gurobi invariati, Gurobi resta partito dal migliore tra DM e la LS precedente).
  Rispetto alla LS precedente: 51 meglio, 12 peggio (massimo +0.40%), 3 uguali; LS batte DM in 36 casi su 66 (prima 32);
  in 4 casi la nuova LS è sotto Gurobi (20×48 α 0.4 e 0.5, 10×48 α 0.3, 15×48 α 1). Tempo totale LS 2623 → 2163 s,
  massimo 165 s. Rigenerati `summary`, grafici e `alpha_tables.pdf` (nota sulla partenza di Gurobi nella didascalia).

## H15. Analisi dei risultati della campagna su α (6/11/2026) [in corso — Andrea]

- Per l'articolo si considera solo la LS (con lo spareggio, H14) contro Gurobi; DM non è riportato. Sezione dei risultati
  in `tex_notes.tex` (radice del repo): nuova versione in blu rispetto a quella GAT, che resta sotto come
  "Results (old version)"; Experimental setup prima di "Scope of the assessment", domande (a) Accuracy of the heuristic e
  (b) Computation time, i valori di α nel setup.
- Tabelle `results_alpha/alpha_tables_noDM.pdf` (script `alpha_tables_noDM.py` nello scratchpad), solo LS e GRB:
  - gap sul bound di Gurobi, in grassetto il migliore tra LS e GRB. 20×48 α = 0.1: GRB 6.28%, valore della soluzione
    restituita, che è il warm start di DM (0.036057; ObjVal di Gurobi 0.037535, scarto del 4%, non di tolleranza); nota
    tolta, il "–" nella tabella dei tempi dice già che Gurobi non ha migliorato il warm start;
  - tempo al best: ° dove il metodo raggiunge l'ottimo dimostrato da Gurobi (sempre 0: LS su 10×24 e 10×48 a α = 0, GRB
    in 6 run); asterischi tolti, perché GRB usa tutta l'ora esattamente nei run senza ° (verificato).
- Scatter gap contro valore f della soluzione (`results_alpha/alpha_scatter_gap.png/.pdf`, script `alpha_scatter.py`):
  gap grandi solo per f < 0.015 (α = 0 e 1, bound 0 o quasi); per f ≥ 0.015 (54 punti per metodo) LS mediana 1.9%,
  massimo 20.5%, 43 sotto il 5%; GRB mediana 0.8%, massimo 6.3%. Segnati con un pallino con croce rossa i 4 casi in cui LS ha gap 100% e Gurobi
  ottiene 0 (15×24 e 15×48 a α = 0, 10×24 e 10×48 a α = 1; LS tra 0.00003 e 0.00007).
- Il testo descrive ancora un setup diverso dalla campagna (20 min, 28 thread, 10 istanze, Gurobi dalla LS): da allineare.
- 6/11: setup di `tex_notes.tex` allineato alla campagna (i7-10700, Ubuntu 22.04, Python 3.10.12, Gurobi 13.0.1, 16 thread,
  1 h per metodo, un'istanza per configurazione con il numero di ordini, Gurobi partito dalla migliore tra DM e la LS
  precedente, dichiarato nel testo). Scritta la sottosezione (a) Accuracy of the heuristic: tabella dei gap (`table*`,
  grassetto con tolleranza relativa 1e-4) e scatter quadrato `results_alpha/alpha_scatter_gap_square.pdf`. Gap relativo
  (f_LS − f_GRB)/max(f_LS, f_GRB); uguali se differiscono meno di 1e-4 (relativo). Statistiche (media, std, mediana):
  66 run: LS 13.78%, GRB 5.65%, relativo 9.56%, LS meglio/peggio/uguale 4/59/3, ottimi GRB 6 (tutti 0), LS 2;
  senza i 4 casi 100–0 e il 100–100 (20×48 α = 1): LS 6.72%, GRB 4.47%, relativo 2.60%, 4/54/3;
  α tra 0.1 e 0.9: LS 3.43%, GRB 1.30%, relativo 2.17%, 3/50/1. Script `acc_stats.py` e `alpha_scatter_square.py` nello
  scratchpad della sessione 3a7e4134.
- 6/11: sottosezione (b) Computation time (`tex_notes.tex`, script `time_stats.py` nello scratchpad della sessione 3a7e4134).
  LS: stop in media 32.8 s (std 25.6, mediana 25.9; 1.8–165 s), migliore a 30.9 s (mediana 23.9); mediana dello stop da
  13 s (10×24) a 58 s (20×48). Gurobi: limite di 1 h in 60 run, ottimo dimostrato in 6 (tutti 0: in 4 il warm start vale
  già 0, prova in 8–36 s; 15×24 e 15×48 α = 0 in 250 e 3148 s); nessun miglioramento in 1 h in 5 run (20×48 α 0.1, 0.2,
  0.3, 1; 15×48 α 1). Negli altri 57: primo miglioramento in media 901 s (mediana 553, da 99 s su 10×24 a 2711 s su
  20×48), migliore a 2899 s (mediana 3225).
