# Project organizer

How to set up a Claude Project so every chat starts with the right instructions and files, and a ready-made project to try it on: a PhD literature review.

## What's in this folder

| File | What it is |
|---|---|
| [`cheat-sheet-claude-projects.pdf`](cheat-sheet-claude-projects.pdf) | One-page cheat sheet (A3): what a project is made of, instructions in 7 blocks, rules that work, daily habits |
| [`lit-review-project-kit.zip`](lit-review-project-kit.zip) | All the kit files below in one download |
| [`lit-review-project-kit/1_INSTRUCTIONS_paste-into-project.txt`](lit-review-project-kit/1_INSTRUCTIONS_paste-into-project.txt) | The project instructions: paste into the **Instructions** box |
| [`lit-review-project-kit/context-files/research-brief.md`](lit-review-project-kit/context-files/research-brief.md) | Problem, research questions and scope. Claude uses it to judge relevance |
| [`lit-review-project-kit/context-files/review-protocol.md`](lit-review-project-kit/context-files/review-protocol.md) | Databases, search strings, inclusion/exclusion criteria (I1–I5, E1–E4) |
| [`lit-review-project-kit/context-files/paper-log.md`](lit-review-project-kit/context-files/paper-log.md) | The table every paper goes into, with a DOI check column |
| [`lit-review-project-kit/context-files/decision-log.md`](lit-review-project-kit/context-files/decision-log.md) | Dated decisions and findings: the memory between chats |

The example topic is rerouting and diverting flights after sudden airspace closures. Try it as it is first, then adapt it to your own topic.

## Set it up (5 minutes)

1. **Download** `lit-review-project-kit.zip` (open it, then click *Download raw file*, the ↓ icon) and unzip it. Or open each file above and copy its text.
2. In Claude, go to **Projects → New project** and give it a clear name. Claude can't see the name or description; they're only for you.
3. Click the pencil next to **Instructions** and paste the whole content of `1_INSTRUCTIONS_paste-into-project.txt`.
4. Click **+** next to **Context** and upload the four `.md` files from `context-files/`. The capacity bar should show about 1%.
5. Turn on **web search**, start a chat inside the project and ask the test question below.

## Test it: same question, two places

Ask exactly this, first in a normal chat outside any project, then in the project:

> Find me 10 key papers for my literature review on rerouting flights after a sudden airspace closure, and summarise them.

Then compare the two answers:

| Did the answer… | Plain chat | Project |
|---|---|---|
| ask what you need before starting? | ☐ | ☐ |
| stay inside your scope (airborne flights, not ground delay programs)? | ☐ | ☐ |
| give a working DOI or link for every paper? (click 3 of them) | ☐ | ☐ |
| mark preprints and agency reports (EUROCONTROL, ICAO, FAA)? | ☐ | ☐ |
| use your table format, ready to paste? | ☐ | ☐ |
| judge each paper by your inclusion criteria (I1–I5, E1–E4)? | ☐ | ☐ |
| name its files and suggest a decision-log entry? | ☐ | ☐ |

Answers vary from run to run. Whatever you get, check a few references yourself: the most common error is a real paper with the wrong authors, journal or year, not an invented one. That's why the instructions ask Claude to check every reference against its DOI record.

## Keep using it

Follow-up questions to try in the same project chat:

- "Which of these papers model diversion-airport capacity? Give the figures with page numbers."
- Paste an abstract: "Include or exclude? Which criterion decides?"
- "Give me search string B adapted for Scopus."
- "Summarise today's decisions for decision-log.md." Then paste the lines into `decision-log.md` and re-upload it to Context.

Chats in a project can't see each other, but they all see Context. Saving results and decisions back to Context is what makes the project smarter over time.

## Adapt it to your own topic

1. Rewrite `research-brief.md` with your problem, research questions and scope.
2. Rewrite the search strings and criteria in `review-protocol.md`.
3. Add 3–5 papers you already trust to the "Seed sources" section of `paper-log.md`.
4. Change the role and goal blocks in the instructions; keep the rules and their "because".

Shortcut: ask Claude to write the instructions for you with the starter prompt at the bottom of the cheat sheet.
