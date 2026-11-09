  <!--
  project_log/STATO.md: current state of the project, short. What the problem is, the current formulation/method,
  where we are and what comes next. Rewrite it (do not append) whenever the state changes; the past goes in HISTORY.md.
  Conventions of the folder: README.md.
-->
# Stato attuale (30/10/2026)

Descrizione breve del problema e di dove siamo. La cronologia completa è in `HISTORY.md` (albero interattivo:
`history_tree.html`), le cose da fare e gli appunti in `note.md`.

## Il problema

Ogni ordine j va assegnato a una fabbrica i e a un bucket (settimana) t. L'orizzonte ha `MAX_WEEK` bucket regolari più
`buffer_buckets` bucket di buffer in coda. Ogni fabbrica ha 1–5 risorse, una critica; un ordine occupa un tempo di lavoro su
ogni risorsa della sua fabbrica e ogni risorsa ha una capacità per bucket. Si vuole tenere il carico delle risorse critiche
vicino al target (80% della capacità) e non consegnare in ritardo.

## Formulazione (`Solvers/model.py`, classe `Model`)

Esatta per l'obiettivo PLA normalizzato. Nessuna aggregazione di job, nessuna variabile di ritardo, nessuna binaria oltre
all'assegnamento.

**Insiemi**
- F fabbriche; J ordini; K_i risorse della fabbrica i, con k_i ∈ K_i la risorsa critica (una per fabbrica).
- T = T^R ∪ T^B bucket: T^R = {0, …, R−1} periodo regolare (R = `MAX_WEEK`), T^B bucket di buffer (|T^B| = `buffer_buckets`).
- h = 1, …, H segmenti della PLA (H = 8), breakpoint ρ = {0, 0.01, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1}.

**Dati**
- p_{i,j,k}: carico dell'ordine j sulla risorsa k se prodotto nella fabbrica i.
- c_{i,k}: capacità della risorsa k di i in un bucket; c = 180 (quarti d'ora, 45 h) per le risorse critiche.
- w = 0.8·c = 144: target delle risorse critiche; c − w = 36: scala della deviazione.
- d_j: due date; D_j ∈ {1, 2, 3, 4}: ritardo massimo (ritardo con penalità normalizzata 1).
- α ∈ [0, 1] (default 0.5), β = 1 − α.

**Funzione PLA.** φ(u) = interpolazione lineare di u² nei breakpoint per u ∈ [0, 1], prolungata linearmente oltre 1 con
l'ultima pendenza (1.8). Convessa, esatta nei breakpoint, ≥ u² tra un breakpoint e l'altro.
Pendenza del segmento h: σ_h = ρ_{h−1} + ρ_h (crescenti).

**Costo di ritardo precalcolato:** g_{j,t} = φ((t − d_j)^+ / D_j).

**Variabili:** x_{i,j,t} ∈ {0, 1} (ordine j in fabbrica i, bucket t); s_{i,t} ≥ 0 deviazione del carico critico dal target;
e^{(h)}_{i,t} ≥ 0 parte della deviazione nel segmento h.

$$
\min\;\; \frac{\alpha}{|F|\,|T|} \sum_{i\in F}\sum_{t\in T}\sum_{h=1}^{H} \frac{\sigma_h}{c-w}\, e^{(h)}_{i,t}
\;+\; \frac{1-\alpha}{|J|} \sum_{i\in F}\sum_{j\in J}\sum_{t\in T} g_{j,t}\, x_{i,j,t}
$$

$$
\begin{aligned}
& \textstyle\sum_{i\in F}\sum_{t\in T} x_{i,j,t} = 1 && \forall j\in J && \text{(assegnamento)}\\
& \textstyle\sum_{j\in J} p_{i,j,k}\, x_{i,j,t} \le c_{i,k} && \forall i\in F,\ k\in K_i,\ t\in T && \text{(capacità)}\\
& s_{i,t} \ge \textstyle\sum_{j\in J} p_{i,j,k_i} x_{i,j,t} - w && \forall i\in F,\ t\in T && \text{(sovraccarico)}\\
& s_{i,t} \ge w - \textstyle\sum_{j\in J} p_{i,j,k_i} x_{i,j,t} && \forall i\in F,\ t\in T^R && \text{(sottocarico, solo periodo regolare)}\\
& \textstyle\sum_{h=1}^{H} e^{(h)}_{i,t} = s_{i,t} && \forall i\in F,\ t\in T && \text{(segmenti PLA)}\\
& 0 \le e^{(h)}_{i,t} \le (\rho_h-\rho_{h-1})(c-w) \ \ (h<H), \quad e^{(H)}_{i,t} \ge 0 && \forall i\in F,\ t\in T\\
& x_{i,j,t}\in\{0,1\},\quad s_{i,t}\ge 0 && \forall i, j, t
\end{aligned}
$$

**Proprietà (per il paper)**
1. *Esattezza.* Per x fissato il minimo su (s, e) vale α/(|F||T|) Σ φ(u_{i,t}), con u = |y − w|/(c − w) in T^R e
   (y − w)^+/(c − w) in T^B: s prende il minimo ammesso e i segmenti si riempiono in ordine (pendenze crescenti).
2. *Normalizzazione.* Entrambi i termini valgono 1 nel caso peggiore (u = 1 ovunque, ritardo D_j per tutti); oltre la
   penalità cresce linearmente (pendenza 1.8). Nel buffer conta solo il sovraccarico.
3. *Ritardo nel costo.* Il ritardo è determinato da t, quindi è un coefficiente di x: niente variabili di ritardo, vincoli
   `'B'`, binaria del buffer, big-M o indicator del modello vecchio.
4. *Dimensioni.* |F||J||T| binarie; |F||T|(H + 1) continue; righe |J| + Σ_i |K_i||T| + |F|(|T| + |T^R|) + |F||T|.
   Esempio 10×24 run 0: |J| = 5290, |T| = 28, 1 481 200 binarie.

## Metodi (branch `test`)

| Metodo | File | In breve |
|---|---|---|
| EDD | `Solvers/BasicHeuristic.py` | Soluzione di riferimento (f_EDD) |
| construction | `Solvers/local_search.py` | Greedy a orizzonte mobile |
| local_search | `Solvers/local_search.py` | Costruzione + LAHC con numba, blocchi paralleli |
| decomposed_model | `Solvers/decomposedModel.py` | Costruzione + blocchi casuali 4×4 risolti esatti, stessa formulazione di `Model` |
| model | `Solvers/model.py` | MIP completo, MIPFocus=3, Method di default, MIPGap 1e-4, warm start da euristica |

Esperimenti: `test_new.py` (`--alpha`, `--model-start local_search|decomposed_model|best|edd`), istruzioni nel `README.md` del repo.
Istanze: seed `41 + run²`, casi 10×24, 10×48, 15×24, 15×48, 20×24, 20×48 (più le varianti `_per_order`).

## Dove siamo

- Le euristiche migliori sono quelle del collega (decomposed_model, poi local_search); `Model` con warm start dalla migliore
  serve per il bound e il gap.
- La certificazione dell'ottimo non si raggiunge in 20 min su 10×24: il gap residuo (~0.4%) è di bound. La configurazione
  migliore trovata è `Model` + MIPFocus=3 (`HISTORY.md` H11).
- Prossimo passo: campagna su α (0, 0.1, …, 1) sui sei casi, run 0 (`HISTORY.md` H13), completata il 5/11 (`results_alpha/`, tabelle in `alpha_tables.pdf`), da valutare.
