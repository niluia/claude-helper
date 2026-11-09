# project_log

Project log: where we are, what has been done (and what was discarded), what is left to do.
Meant to be read and updated both by people and by a Claude session that does not know the history of the project.

## Files

| File | What it contains | How it is updated |
|---|---|---|
| `STATUS.md` | Current state, short: the problem, the current solution/formulation, where we are, next step | **Rewritten** when the state changes |
| `HISTORY.md` | Detailed chronology, one section per step (`## H<n>. Title (date) [status]`) with numbers, tables and the reason for each choice | **Appended** at the end; never deleted, only corrected |
| `notes.md` | Notes only: to-do list, pending ideas, agreed rules, useful paths | When an item is done or dropped, its outcome goes into `HISTORY.md` |
| `history_tree.html` | Interactive tree of the history (browser tab: *Work tree*): central branch = accepted steps, side branches = discarded or superseded attempts; click = details | **Not edited**: it is generic |
| `history_data.js` | Content of the tree: one row per step, nodes with the same id as the sections of `HISTORY.md` | Updated **together with** `HISTORY.md` |

Statuses: `acc` accepted · `run` running · `pen` pending · `dis` discarded · `sup` superseded (used, then replaced).

**Project leader** (`leader` in `history_data.js`): whoever started the project. The leader is the only one who marks a
step as accepted (`acc`); everyone else, and Claude sessions, propose and wait for the leader's confirmation. Running
branches (`run`) carry the name of whoever is running the test (`who`), shown on the branch.

## Instructions for a Claude session

1. At the start, read `STATUS.md` (context) and `notes.md` (agreed rules and to-do list); `HISTORY.md` only for details.
2. When a test or an attempt starts: add a section and a node with status `run` and `who` = whoever is running it.
3. For every finished step (accepted, discarded or superseded), with the user's agreement (for `acc`: only the leader):
   - add section `H<n>` at the end of `HISTORY.md`, with date, status, what was done, numbers and the reason for the decision;
   - add the node with the same id to `history_data.js`: `trunk` if accepted, `left`/`right` of the row of the accepted
     step it refers to if discarded or superseded; `d` is a short summary in HTML;
   - if a previously accepted step is replaced, change its status to `sup` in both files (do not delete it);
   - update `STATUS.md` if the current state changes, and remove/tick the item in `notes.md`.
4. Do not put chronology or results in `notes.md`: they go into `HISTORY.md`.
5. Check: open `history_tree.html` in the browser (works from disk, without a server).

## Using it in another project

Copy this folder into the new project (for example as `project_log/`), fill in `STATUS.md` and the title in
`history_data.js`. To make Claude sessions find it, add a line like this to the project's `CLAUDE.md`:

> Project log in `project_log/` (status, history, notes): read `project_log/README.md` and follow its instructions.
