// Data of history_tree.html: one entry per row of the tree, in chronological order. Edit this file, not the HTML.
// Each row: { left: [nodes], trunk: node, right: [nodes] } (left/right optional, any number of nodes).
//   trunk = accepted step of the project (central branch); left/right = discarded or superseded attempts (side branches).
// leader: project leader, who started the project; only the leader marks a step as accepted ('acc').
// Each node: { id, date, s, t, d, who }
//   id:   section of HISTORY.md with the same id (e.g. 'H4c' <-> '## H4c. ...'), shown as reference in the popup
//   date: 'dd/mm'
//   s:    status: 'acc' accepted (by the leader) | 'run' running | 'pen' pending | 'dis' discarded | 'sup' superseded
//   t:    short title shown on the branch
//   who:  for 'run': who is running it (shown on the branch)
//   d:    HTML shown in the popup (short summary of the HISTORY.md section: <p>, <ul>, <table>, <code>, <b>)
// Loaded with <script src>, so the page also works opened directly from disk (file://), without a server.
window.HISTORY_DATA = {
  title: 'Load balancing: evoluzione del problema e delle soluzioni',
  year: '2026',
  leader: 'Andrea Gasparin',
  // rows in chronological order: trunk = accepted step, left/right = discarded or superseded branches
  rows: [
    { trunk: { id: 'H1', date: '28/10', s: 'acc', t: 'Punto di partenza: paper e check del codice',
        d: `<p>Lavoro descritto in <code>Work_Load_Balancing.pdf</code>: carico approssimato a gradini, modello esatto <code>ExactSolver</code>, decomposizione divide et impera (random o GAT).</p>
            <ul><li><b>Bug in <code>Solvers/solver.py:163</code></b>: <code>float(j)</code> invece di <code>float(jj)</code>; tutti i breakpoint a 0, modello infeasible.</li>
            <li>Colonna GAT della Tabella 3 diversa da <code>squared.csv</code>; colonna Exact non riproducibile.</li></ul>` } },

    { left: [{ id: 'H2', date: '28/10', s: 'dis', t: 'Modello aggregato (job identici come interi)',
        d: `<p>Job con stesso prodotto e due date aggregati in interi n[i,c,t]: 2371 classi su 11440 job (20×24).</p>
            <table><tr><th></th><th>Base</th><th>Ritardo nell'obiettivo</th><th>Aggregato</th></tr>
            <tr><td>Costruzione</td><td>~5.7 min</td><td>34 s</td><td>6.6 s</td></tr>
            <tr><td>Presolve</td><td>95 s</td><td>68 s</td><td>12 s</td></tr>
            <tr><td>RAM</td><td>10 GB</td><td>7 GB</td><td>1.5 GB</td></tr></table>
            <p>Stesso bound, ma la ricerca si fermava a 0.147 contro 0.668. <b>Decisione: mai aggregare i job.</b> Resta solo il ritardo nell'obiettivo.</p>` }],
      trunk: { id: 'H3', date: '28/10', s: 'acc', t: 'Carico: da gradini a PLA',
        d: `<p>Le binarie dei gradini sostituite dalla <b>PLA</b> (secanti di s² tra breakpoint), con segmenti continui senza binarie: le pendenze ρ<sub>h−1</sub>+ρ<sub>h</sub> sono crescenti, quindi i segmenti si riempiono in ordine.</p>
            <p>Breakpoint ρ = {0, 0.01, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1}. s² ≤ PLA ≤ gradini. Funzioni in <code>Instance/factory.py</code>.</p>` },
      right: [{ id: 'H3b', date: '28/10', s: 'dis', t: 'Tangenti (approssimazione inferiore)',
        d: `<p>q ≥ 2·a<sub>h</sub>·s − a<sub>h</sub>²: approssimazione inferiore convessa. Superata dalla PLA, esatta nei breakpoint.</p>` }] },

    { left: [{ id: 'H4a', date: '28/10', s: 'sup', t: 'Peso per job sul ritardo',
        d: `<p><code>Order.weight</code>, prima discreto {0.1,…,1}, poi U(0, 1]. Sostituito dal ritardo massimo D<sub>j</sub>.</p>` }],
      trunk: { id: 'H4c', date: '28/10', s: 'acc', t: 'Obiettivo normalizzato (α, β = 1 − α)',
        d: `<p>obj = α · media su (risorsa critica, bucket) di PLA(u²) + (1 − α) · media sugli ordini di PLA((d<sub>j</sub>/D<sub>j</sub>)²)</p>
            <ul><li>u = |y − w|/(c − w) nel periodo regolare, (y − w)<sup>+</sup>/(c − w) nel buffer.</li>
            <li>D<sub>j</sub> uniforme su {1, 2, 3, 4}; stessi breakpoint per i due termini; oltre 1 pendenza 1.8.</li>
            <li>Media per (risorsa, bucket), buffer compreso: entrambi i termini valgono 1 nel caso peggiore e α ha lo stesso significato su orizzonti diversi.</li></ul>` },
      right: [{ id: 'H4b', date: '28/10', s: 'sup', t: 'Normalizzazione sulla soluzione EDD',
        d: `<p>α·QL/QL<sub>EDD</sub> + (1 − α)·JD/JD<sub>EDD</sub>. Da qui resta il solo parametro α con β = 1 − α; la normalizzazione è stata sostituita da quella sui casi peggiori.</p>` }] },

    { left: [{ id: 'H5', date: '28/10', s: 'dis', t: 'Decomposizione e GAT messe da parte',
        d: `<p><code>Factory.split</code>, <code>PairModel</code>, <code>divideEtImperaSolver</code> non allineati al nuovo obiettivo; GAT da riaddestrare; bug in <code>divideEtImperaSolver.py:134</code> mai corretto.</p>
            <p>Nel branch <code>test</code> il collega li ha rimossi dal repo.</p>` }],
      trunk: { id: 'H6', date: '28/10', s: 'acc', t: 'Nuovo modello Model (Solvers/model.py)',
        d: `<ul><li>Costo di ritardo precalcolato come coefficiente di x: spariscono le ~6M righe del vincolo <code>'B'</code>.</li>
            <li>Buffer: solo s ≥ y − w (niente binaria, big-M, indicator); carico come espressione lineare.</li>
            <li>Segmenti PLA continui; tempo limite totale, costruzione inclusa.</li></ul>
            <p>20×24 run 0, 10 min: <b>Model 0.567</b> di miglioramento su EDD, modello vecchio 0.000 (root LP non finita).</p>` } },

    { trunk: { id: 'H7a', date: '28/10', s: 'acc', t: 'LP: simplesso duale (Method=1)',
        d: `<table><tr><th>Caso</th><th>LP (s)</th></tr><tr><td>20×24</td><td>96</td></tr><tr><td>15×48</td><td>164</td></tr><tr><td>20×48</td><td>310</td></tr></table>
            <p>LP quasi intero (99.98%). Dentro il MIP però Method=1 rallenta la root: nel MIP si è tornati al default (H11e).</p>` },
      right: [{ id: 'H7b', date: '28/10', s: 'dis', t: 'PDHG', d: `<p>Non converge in 900 s. Non usato.</p>` }] },

    { left: [{ id: 'H8a', date: '29/10', s: 'dis', t: 'V1: fissaggio a 0 con prob. 1 − LP',
        d: `<p>Sempre infeasible: con l'LP intero al 99.98% resta circa una posizione per ordine e le capacità saltano.</p>` }],
      trunk: { id: 'H9', date: '29/10', s: 'acc', t: 'Campagna di validazione (5 run, 20 min)',
        d: `<p>10×24, 15×48, 20×24; gap medio sul miglior bound:</p>
            <table><tr><th>Istanza</th><th>v1 (V2)</th><th>v2 (V3)</th><th>Model + EDD</th></tr>
            <tr><td>10×24</td><td>5.72%</td><td>4.76%</td><td>0.59%</td></tr>
            <tr><td>15×48</td><td>6.61%</td><td>6.07%</td><td>79%</td></tr>
            <tr><td>20×24</td><td>8.50%</td><td>7.71%</td><td>3.74%</td></tr></table>
            <p>Nasce <code>test_new.py</code> per il collega (stesse istanze, seed 41 + run²).</p>` },
      right: [{ id: 'H8b', date: '29/10', s: 'sup', t: 'V2: fissaggio deterministico + MIP ridotto',
        d: `<p>Job per Max_lp<sub>j</sub> decrescente, fissati nella posizione LP massima se il carico resta ≤ 95%; MIP ristretto scritto già ridotto.</p>
            <table><tr><th>Caso</th><th>obj</th><th>gap su LP</th><th>tempo</th></tr>
            <tr><td>20×24</td><td>0.16248</td><td>3.1%</td><td>146 s</td></tr><tr><td>15×48</td><td>0.18518</td><td>2.1%</td><td>295 s</td></tr>
            <tr><td>20×48</td><td>0.13195</td><td>3.9%</td><td>553 s</td></tr></table>` },
        { id: 'H8c', date: '29/10', s: 'sup', t: 'V3: fissaggio probabilistico (10 iterazioni)',
        d: `<p>Job fissato con probabilità Max_lp<sub>j</sub>, posizione estratta con probabilità x<sup>LP</sup><sub>i,j,t</sub>; fino a 10 iterazioni, LP calcolato una volta. Leggermente meglio di V2, superata dalle euristiche del collega.</p>` }] },

    { trunk: { id: 'H10a', date: '29/10', s: 'acc', t: 'Euristiche del collega: local_search e decomposed_model',
        d: `<p>LAHC con numba e blocchi casuali 4×4 risolti esatti. Gap sul miglior bound:</p>
            <table><tr><th>Istanza</th><th>local_search</th><th>decomposed_model</th><th>decomposed_alt</th></tr>
            <tr><td>10×24 r0</td><td>1.79%</td><td>0.47%</td><td>0.49%</td></tr><tr><td>10×24 r1</td><td>6.70%</td><td>3.05%</td><td>2.44%</td></tr>
            <tr><td>15×48 r0</td><td>0.66%</td><td>0.56%</td><td>0.57%</td></tr><tr><td>20×24 r0</td><td>1.67%</td><td>1.38%</td><td>1.37%</td></tr></table>` },
      right: [{ id: 'H10b', date: '29/10', s: 'dis', t: 'decomposed_alt (v5)', d: `<p>Alternanza di blocchi esatti e ricerca locale: simile a v4, rimossa nel branch <code>test</code>.</p>` }] },

    { left: [{ id: 'H11a', date: '30/10', s: 'dis', t: 'Fissaggio per costi ridotti',
        d: `<p>x fissata a 0 se d > Δ = z<sub>inc</sub> − z<sub>LP</sub>. Δ = 1.1% dell'incumbent: resta l'80.5% delle binarie. Teoria in <code>presolve_tests/reduced_cost_fixing.pdf</code>.</p>` },
        { id: 'H11b', date: '30/10', s: 'dis', t: 'Taglio sui costi ridotti', d: `<p>Σ d<sub>k</sub>·x<sub>k</sub> ≤ Δ: bound appena più alto (nel rumore di un run), più lento all'inizio.</p>` }],
      trunk: { id: 'H11e', date: '30/10', s: 'acc', t: 'Certificazione: Model + MIPFocus=3',
        d: `<p>10×24 run 0, incumbent v4, 20 min:</p>
            <table><tr><th>variante</th><th>bound</th><th>gap</th><th>gap ≤ 0.6%</th></tr>
            <tr><td>base</td><td>0.058640</td><td>0.567%</td><td>470 s</td></tr><tr><td>fissaggio</td><td>0.058685</td><td>0.566%</td><td>857 s</td></tr>
            <tr><td>fissaggio + taglio</td><td>0.058708</td><td>0.428%</td><td>738 s</td></tr><tr><td>+ MIPFocus=3, Cuts=2</td><td>0.058727</td><td>0.547%</td><td>1021 s</td></tr>
            <tr><td><b>base + MIPFocus=3</b></td><td><b>0.058734</b></td><td>0.441%</td><td><b>203 s</b></td></tr></table>
            <p>Nessuna variante certifica: il gap residuo (~0.4%) è di bound.</p>` },
      right: [{ id: 'H11c', date: '30/10', s: 'dis', t: 'MIPFocus=3 + Cuts=2', d: `<p>Bound alto ma solo dopo ~1000 s di tagli alla root; incumbent fermo.</p>` },
        { id: 'H11d', date: '30/10', s: 'dis', t: 'Rottura delle simmetrie', d: `<p>2341 ordini in 1068 classi identiche. Scartata: è una caratteristica del generatore, non del problema (confronto non equo).</p>` }] },

    { trunk: { id: 'H12', date: '30/10', s: 'acc', t: 'Branch test del collega e allineamento',
        d: `<ul><li>Pulizia del repo, <code>buffer_buckets</code>, istanze <code>per_order</code>, <code>test_new.py</code> riscritto con results.csv e soluzioni.</li>
            <li>Blocchi di decomposed_model con la stessa formulazione di Model (38 blocchi, obj 0.070283 contro 37 e 0.070437).</li>
            <li>Model con MIPFocus=3 e Method di default; <code>--alpha</code> e <code>--model-start best</code>.</li></ul>` } },

    { trunk: { id: 'H13', date: '30/10', s: 'run', who: 'Andrea', t: 'Campagna su α (0 … 1, passo 0.1)',
        d: `<p>6 casi, run 0; local_search e decomposed_model, poi Model con warm start dalla migliore; 1 h per metodo. Dal 30/10 al 5/11, output in <code>results_alpha/</code>; tabelle in <code>alpha_tables.pdf</code>.</p>
          <p>Gurobi certifica l'ottimo solo in 6 run su 66 (obj = 0). Gap per α 0.1–0.9: 0.07–2.7% fino a 20×24, 2.4–6.3% su 20×48 (resta al nodo radice); molto peggio agli estremi. DM migliore con α ≤ 0.2 e ≥ 0.7, LS con α 0.3–0.6; LS si ferma in 2–300 s, DM usa tutta l'ora.</p>
          <p>Corretto <code>test_new.py</code>: gap = 0 quando obj = 0 (6 run di model andati in errore, rilanciati a fine campagna) e tolleranza relativa del check.</p>
            <p>Poi: Model senza warm start, per confronto.</p>` },
      right: [{ id: 'H14', date: '05/11', s: 'run', who: 'Andrea', t: 'Local search a α = 0: diagnosi',
        d: `<p>A α = 0 LS è molto peggio di DM sui casi grandi (20×24: 0.0274 contro 0.0103). A α = 1 la differenza è solo apparente (obiettivi vicini a 0, bound debole).</p>
            <p>LS satura quasi tutti i bucket (uso 99.9%) e lascia più ordini in ritardo; ipotesi: relocate quasi sempre infeasible e scelta uniforme dell'ordine che pesca soprattutto mosse neutre.</p>
            <p>Prove su 20×24 e 20×48, solo parametri, stop normale (LS deve restare veloce): <code>base</code>, <code>cost</code>, <code>group3</code>, <code>wide</code>, <code>cost_group3</code>.</p>
            <p>Nessuna variante chiude la distanza: 20×24 tra 0.0274 e 0.0285 (DM 0.0103), 20×48 tra 0.0150 e 0.0158 (DM 0.0053), stop in 234–578 s. Limite strutturale: LS anticipa pochissimi ordini (127 contro 408 di DM e 924 di Gurobi).</p>
            <p>Mossa a catena (fino a 3 ordini, scratchpad): nessun effetto. Causa: con α = 0 spostare un ordine in una fabbrica più lenta è gratis e la ricerca deriva verso assegnamenti inefficienti (lavoro +6.5–8.9% sul minimo, contro +4.9–5.6% di DM e Gurobi), che consumano capacità.</p>
            <p><b>Spareggio sul lavoro</b> (mossa a costo invariato accettata solo se non aumenta il tempo di lavorazione): α = 0 20×24 0.0274 → 0.0102 in 64 s (DM 0.0103 in 1 h), 20×48 0.0152 → 0.0058 in 52 s; 15×24 e 15×48 meglio di DM. Con α > 0 variazioni entro ±0.45%, nel rumore.</p>
            <p>6/11: <b>tenuto</b>, portato in <code>Solvers/local_search.py</code> (<code>ls_work_tie</code>, default attivo). Rifatta solo la LS della campagna su α: 51 run meglio, 12 peggio (max +0.40%), LS batte DM in 36 casi su 66 (prima 32), tempo totale 2623 → 2163 s. Grafici e PDF aggiornati; Gurobi non rifatto (partito dalla LS precedente).</p>` }],
      left: [{ id: 'H15', date: '06/11', s: 'run', who: 'Andrea', t: 'Analisi dei risultati su α (LS contro Gurobi)',
        d: `<p>Solo LS (con lo spareggio) contro Gurobi, DM non riportato. Testo dei risultati in <code>tex_notes.tex</code>, modifiche in blu; Experimental setup prima di Scope of the assessment, domande accuracy e computation time, valori di α nel setup.</p>
            <p>Tabelle <code>alpha_tables_noDM.pdf</code>: gap con il migliore in grassetto (20×48 α = 0.1: 6.28%, valore della soluzione restituita, nota tolta); tempi con ° dove l'ottimo è raggiunto, asterischi tolti (GRB usa tutta l'ora esattamente dove non c'è °).</p>
            <p>Scatter gap contro f: gap grandi solo per f &lt; 0.015 (α = 0 e 1); per f ≥ 0.015 LS mediana 1.9% (max 20.5%), GRB 0.8% (max 6.3%). Pallino con croce rossa sui 4 casi con LS al 100% e Gurobi a 0.</p>` }] },
  ],
};
