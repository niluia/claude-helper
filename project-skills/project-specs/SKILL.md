---
name: project-specs
description: Guided workflow for defining specs with the user BEFORE any implementation starts, for a whole project, a single feature, or one aspect such as tests, architecture, an API or a data model. Use this skill whenever the user wants to define, plan, scope, spec out or design something they will build with Claude, mentions specs, a specs folder, requirements, acceptance criteria or a task breakdown, or says they want to plan before coding, even if they don't explicitly ask for "specs". Covers analyzing an existing specs folder, clarifying the goal, breaking work into agile tasks with checkpoints and validation, and a final verification review.
---

# Project Specs

This skill guides Claude and the user through defining clear, verified specs before any work starts. Good specs prevent wasted effort: they make the goal explicit, break the work into small pieces that can each be shown to work, and surface key decisions while they're still cheap to change.

Follow the four steps in order. Don't skip ahead or start implementing, even if the user's request seems simple, because the point of this workflow is that nothing gets built on unverified assumptions.

## Working principles (apply throughout)

- **Ask one question at a time** and build on each answer. A wall of questions gets shallow answers.
- **Get explicit confirmation before moving on** to the next step, and before writing anything to the specs.
- **Stay on the what and why** until Step 3. Note implementation ideas when the user raises them, but don't design the solution early.
- **Never change specs silently.** If something conflicts with existing specs or with an earlier decision, flag it and discuss it with the user.
- **Prefer extending the existing spec file for an area** over creating a new one for the same area, so each area stays in one coherent place.
- **Split specs into small files by default, without waiting for the user to ask.** Claude works on one task at a time and should load only what that task needs. A large single file wastes tokens and context on every task and makes changes harder to review. Organise each piece of work as a folder with a short `README.md` (summary, file guide, task status table, change log), one file per area (e.g. `goal.md`, `protocol.md` or `design.md`), and a `tasks/` folder with one file per task. Each task file starts with a "Read first" line listing the exact files and sections it depends on, plus a status line. Propose this layout in Step 1 and explain why.

## Environment: Claude Code vs. Claude Project

Check which situation you're in before Step 1, because it changes how specs are saved.

- **Claude Code (or any environment with direct access to the repo):** read and edit the spec files in the repo directly.
- **Claude Project (claude.ai):** you can read files in the project knowledge but can't write back to them. Produce the new or updated spec files as downloadable files, state clearly which existing file each one replaces, and remind the user to re-upload them to the project knowledge (and to their repo, if that's where the specs live).

---

## Step 1: Identify the work and analyze the specs folder

Ask the user what they're working on: a full project, a single feature, or a specific aspect such as tests, architecture, an API or the data model. Then ask whether a specs folder already exists.

**If a specs folder exists:**
1. Read every file in it.
2. Summarize back to the user what's already specified, briefly, file by file.
3. Identify where the new specs fit: which existing files and sections they touch, whether they extend, refine or conflict with what's there, and whether anything genuinely needs a new file.
4. Propose a plan (e.g. "add a new section to `api.md`, update the acceptance criteria in `auth.md`, create `tests/payment-flow.md`") and get the user's confirmation before continuing.

Only create a new file when the new specs don't belong in any existing one, and say why. Flag conflicts with existing specs immediately rather than overwriting them.

Also check for a `conventions.md` (or `README.md`) in the specs folder: it may hold an agreed task template or other conventions from earlier sessions that you should reuse.

**If no specs folder exists:** propose a name and location (e.g. `specs/` at the repo root, with a sub-folder per piece of work laid out as in the working principle on small files), confirm with the user, and create it.

## Step 2: Identify the goal

Interview the user until the goal is clear enough to write down in a few sentences. Don't run through a fixed questionnaire; follow up on what the user says. Aim to understand:

- **The problem:** what's wrong, missing or painful today, and for whom.
- **The intended outcome:** what will be different once this is done.
- **Success:** how the user will know it worked (observable behavior, a metric, a passing test suite, a user being able to do something they couldn't before).
- **The motivation:** why this matters now. This helps with sensible trade-offs later.

Probe vague answers ("make it better", "clean up the code") until they're concrete. If the user drifts into implementation details, note them for Step 3 and steer back to the goal.

If this is a feature or aspect within a larger project and the specs already describe the project's goals, check that the new goal fits them and point out any tension.

When the goal is clear, write a short goal statement, read it back to the user and revise until they confirm it. Then save it in the location agreed in Step 1.

## Step 3: Break the goal into tasks

Using an agile, incremental approach, break the confirmed goal into small tasks that each deliver something working and demonstrable, so progress is visible throughout rather than only at the end. Prefer thin end-to-end slices (a small piece that works all the way through) over horizontal layers (all the database work, then all the API work), because a slice can be shown and validated on its own.

Order tasks so the riskiest or most uncertain parts come first, and respect dependencies. Every task must have:

- **Scope:** what's in and what's explicitly out. Tight enough to be done and reviewed in one sitting; if it isn't, split it.
- **Checkpoint:** the concrete deliverable that marks the task as done.
- **Review and validation:** how the output will be checked and measured: specific tests that must pass, a metric or threshold, a manual check, or a demo of a behavior. Prefer objective, repeatable checks.
- **Adjust and iterate:** what to do if validation fails, such as fixing and re-validating, narrowing or splitting the task, or revisiting dependent tasks.

**Task template.** Unless the specs folder already holds an agreed template, show the user this default and ask whether they want to modify it before writing any tasks:

```markdown
### Task N: <name>
- Scope: ...
- Out of scope: ...
- Checkpoint: ...
- Validation: ...
- If validation fails: ...
- Depends on: ...
```

Use the agreed version for every task. If the user modifies it, save it in `conventions.md` in the specs folder so future sessions reuse it instead of asking again.

Present the breakdown as a numbered list, discuss it, and revise until the user confirms. Then save each task in its own file under `tasks/`, with its "Read first" and status lines, and add the task to the status table in the folder's `README.md`.

**When a review raises an issue** (now or later, while the tasks are being worked on): don't change the specs, the task list or the plan on your own. Flag the issue to the user, explain what was found and which tasks or specs it affects, and discuss what to change and how. Apply changes only once the user agrees, and record what changed and why in the relevant spec file.

## Step 4: Review and verify the specs

Walk through the full set of specs with the user to confirm they're ready to build from. The aim is that nothing is missing and the user is confident every design aspect is covered.

1. **Precision.** Go through each spec and check it could be implemented without guessing. Point out anything ambiguous, such as undefined terms, unstated behavior, or missing inputs, outputs, limits or error cases, and resolve it with the user.
2. **Completeness.** Check for design aspects that haven't been addressed. For coding work, typical ones are: edge cases and error handling, data model and validation, interfaces and APIs, testing approach, performance, security and permissions, dependencies, migration or backward compatibility, and observability. Not all apply every time; ask the user about the ones that plausibly do rather than assuming they're irrelevant.
3. **Size and compartmentalization.** Check each spec is small and self-contained enough to fit the agile breakdown: one area per spec, no spec that only makes sense alongside several others, and every task traceable to the spec it implements. If something is too large or tangled, propose how to split it and review the change with the user.
4. **Key decisions.** List every key decision made during the process (scope choices, technical choices, trade-offs, things deliberately left out). Have the user confirm each one explicitly, one by one. Silence or a general "looks good" isn't confirmation of a specific decision; a decision the user hasn't consciously agreed to is a likely source of surprises later.
5. **Closing interview.** Run a short interview, a few targeted questions, to check the user understands and agrees with the whole: for example, ask them to state in their own words what the first task will deliver and how it will be validated, or what happens if a particular validation fails. If an answer reveals a gap or misunderstanding, go back and fix the relevant spec.

Once everything is verified, save the final specs (or, in a Claude Project, provide the final files with re-upload instructions) and give the user a brief summary: what was specified, where it's saved, and the first task to start with.

Finally, offer to run the project-verifier skill next, to define how Claude will check the work against these specs.
