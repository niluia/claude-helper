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
  title: 'Nome del progetto: evoluzione del problema e delle soluzioni',
  year: '2026',
  leader: 'Nome Cognome',
  rows: [
    // example: replace with the real steps (same ids as the sections of HISTORY.md)
    { trunk: { id: 'H1', date: 'gg/mm', s: 'acc', t: 'Punto di partenza',
        d: `<p>Situazione iniziale: problema, codice, primi controlli.</p>` } },
    { left: [{ id: 'H2b', date: 'gg/mm', s: 'dis', t: 'Tentativo scartato',
        d: `<p>Cosa si è provato e perché è stato scartato.</p>` }],
      trunk: { id: 'H2', date: 'gg/mm', s: 'acc', t: 'Scelta accettata',
        d: `<p>Cosa si è fatto, numeri principali.</p>` } },
    { right: [{ id: 'H3b', date: 'gg/mm', s: 'run', who: 'Nome', t: 'Test in corso',
        d: `<p>Cosa si sta provando, chi lo sta facendo, dove sono i risultati.</p>` }],
      trunk: { id: 'H3', date: 'gg/mm', s: 'pen', t: 'Prossimo passo',
        d: `<p>In attesa.</p>` } },
  ],
};
