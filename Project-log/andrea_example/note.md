<!--
  project_log/note.md: notes only. To-do list, ideas not yet tried, working rules agreed with the user, paths.
  When an item is done or dropped, move its outcome to HISTORY.md and remove it (or tick it) here.
  Conventions of the folder: README.md.
-->
# Note

Solo appunti e cose da fare. Lo stato del progetto è in `STATO.md`, la cronologia di quanto fatto in `HISTORY.md`
(albero: `history_tree.html`).

## Da fare

- [ ] Mettere competenza su Claude app.
- [ ] **Paper, soluzione iniziale ed EDD**: aggiungere in `tex_notes.tex` un breve confronto della soluzione iniziale
      (`construction`) e dell'EDD con LS e Gurobi (gap e tempo; `construction_obj`, `construction_time`, `f_EDD`, `edd_time`
      in `results_alpha/alpha_*/results.csv`). Lo Scope elenca la soluzione iniziale tra i metodi valutati, ma (a) e (b)
      riportano solo LS e Gurobi; l'EDD serve perché lo chiederanno i reviewer.
- [x] **Rifare la campagna**: fatta dal 6/11 al 9/11 (`campaigns/alpha_campaign.sh`, output in `results_alpha_v2/`): 6 casi,
      run 0, 11 α; construction, LS (con spareggio), Gurobi senza MIP start; 1 h per metodo.
- [ ] **Campagna Gurobi + warm start dalla LS attuale** (`--model-start local_search`, solo `model`, stessi 66 casi, 1 h,
      ~66 h). Le run vecchie di `results_alpha/` non si possono riusare (Gurobi partito da DM in 32 casi e dalla LS vecchia
      in 34, uguale all'attuale solo in 2). Quando indicato.
      In `tex_notes.tex` (Scope of the assessment) togliere la frase sulla "previous version of the local search" da cui partiva Gurobi e ricontrollare la descrizione del warm start (ed eventuali rimandi a
      `sec:ls_moves`).
- [ ] **Campagna su α** (`HISTORY.md` H13): 6 casi, run 0, α = 0, 0.1, …, 1; local_search e decomposed_model, poi `Model`
      con `--model-start best`; 1 h per metodo (~5.5 giorni). Completata il 5/11, output in `results_alpha/` (esito in H13): da valutare.
- [x] **`Model` senza warm start**: fatto nella campagna di `results_alpha_v2/` (`--model-start none`).
- [ ] Provare `test_new.py` con il collega sulle stesse istanze.
- [ ] Ripetere su più istanze il confronto di certificazione base / base + MIPFocus=3 (un solo run finora, `HISTORY.md` H11).

## Idee in sospeso

- Disuguaglianze valide sulla discretezza dei carichi (tagli di tipo knapsack/MIR su y − s ≤ w per bucket e risorsa).
- Bound lagrangiano: dualizzare l'assegnamento, sottoproblemi per fabbrica risolti esatti (bound ≥ LP).
- Con α = 0 il problema è banale (la costruzione trova obj 0): valutare se escluderlo dalla campagna.

## Appunti

- Non usare trucchi legati al generatore di istanze (es. simmetria tra ordini identici): confronto non equo.
- Mai aggregare i job.
- Tempi limite sempre totali, costruzione del modello inclusa; MIPGap di default (1e-4); tutti i thread (16).
- `Method=1` è il migliore per l'LP da solo, ma dentro il MIP rallenta la root: nel MIP si usa il default.
- Script delle prove nello scratchpad della sessione (cartella temporanea, copiarli nel repo se servono):
  `/tmp/claude-1000/-home-andrea-Scrivania-Load-Balancing/dd8dacfa-e511-48c7-8e2f-ffb4a4529cc7/scratchpad/presolve/`
  (`heur.py` euristiche LP V2/V3, `cert.py` test di certificazione, `camp/` log della campagna).
- File non tracciati da git nel branch `test`: `Graph/`, `GAT/`, `Solvers_old/`, `Greedy_pairings/`, `main.py`,
  `Solvers/solver_handler.py` (codice legacy).
- La GAT era addestrata con l'obiettivo a gradini: se si riprende, va riaddestrata.
