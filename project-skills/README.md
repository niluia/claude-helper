# Project skills

Three Claude skills that guide you, step by step, through preparing a project before and while Claude works on it.
Each one is an interview: Claude inspects the project, proposes concrete content, asks one question at a time, and
writes nothing without your explicit confirmation.

| Skill | Role | In one line |
|---|---|---|
| [project-specs](project-specs/SKILL.md) | The **blueprint** | Define *what* to build and *why*, broken into small, verifiable tasks, before any code is written. |
| [project-verifier](project-verifier/SKILL.md) | The **quality control** | Define *how* Claude checks that its output is correct. |
| [project-environment](project-environment/SKILL.md) | The **workshop** | Set up *where and how* Claude works: CLAUDE.md, permissions, connectors, subagents, hooks, skills. |

They work on their own, but are designed to be used together, and each one offers the others at the end.

---

## project-specs

Defines specs with you **before** implementation starts, for a whole project, a single feature, or one aspect
(tests, architecture, an API, a data model).

1. **Identify the work and analyze the specs folder.** Reads any existing specs and fits the new work into them,
   or proposes a new `specs/` folder.
2. **Identify the goal.** Interviews you on the problem, the intended outcome, how success is measured and why it
   matters now, until it fits in a short, confirmed goal statement.
3. **Break the goal into tasks.** Small, incremental tasks (thin end-to-end slices, riskiest first), each with scope,
   checkpoint, validation and what to do if validation fails.
4. **Review and verify the specs.** Checks precision, completeness and size, has you confirm every key decision one
   by one, and ends with a short interview to make sure you agree with the whole.

**Output:** a specs folder split into small files (a `README.md` with a task status table, one file per area, and a
`tasks/` folder with one file per task), so Claude loads only what each task needs.

## project-verifier

Defines "the verifier": exactly how Claude will check that its work is correct. Works for a new project, a new
feature (e.g. one just specced with project-specs), or a new test or check.

1. **Review existing verification.** Tests, linters, CI, critic agents, verification notes in `CLAUDE.md`.
2. **Set precise evaluation criteria.** Specific, checkable, unambiguous criteria, split into must-haves (which
   block a task from being marked done) and nice-to-haves. Vague words like "clean" or "fast" are turned into
   concrete, measurable statements.
3. **Set up an independent critic.** A different model, a fresh Claude agent without the working context, or both;
   it receives only the output, the criteria and the specs, and gives a pass/fail verdict per criterion with evidence.
4. **Pull in external feedback.** Running the code, CI, staging deployments, browser checks, logs, benchmarks or
   people, with what each one checks and when. Anything with side effects needs your approval.

**Output:** a verifier document (e.g. `specs/verifier.md`) and, with your agreement, a pointer in `CLAUDE.md` so
Claude runs it before marking any task done.

## project-environment

Sets up the environment Claude works in, so whole classes of mistakes are prevented rather than caught afterwards.

1. **CLAUDE.md.** Repo structure, Claude-related files, knowledge architecture (what Claude may read, change,
   create, move or delete), project lifecycle, and working rules. Optionally adds the
   [Project log](../Project-log/) to track every experiment. Strict rules are enforced with permission rules.
2. **Connectors (MCP servers).** Which external systems Claude may reach, read-only by default.
3. **Subagents.** Reusable specialists (critic, code reviewer, test writer, ...) with only the tools they need.
4. **Hooks and automation.** Guard rails, formatting, automatic checks, loading context at session start.
5. **Skills and plugins management.** Where skills live, how they are changed, and how the team stays in sync.

**Wrap-up:** checks that everything is consistent, then tests it in a fresh session (questions Claude should now
answer correctly, a denied action, a triggered hook).

---

## How to use them

### Install

The skills are folders containing a `SKILL.md`. Copy the ones you want into a skills folder:

- **Personal** (available in all your projects): `~/.claude/skills/`
- **Per project** (shared with the team via the repo): `<your-project>/.claude/skills/`

On **claude.ai**, zip each skill folder (e.g. `project-specs/` with its `SKILL.md`) and upload it under
*Settings → Capabilities → Skills*. In a Claude Project, the skills cannot write files directly, so Claude gives you
the files to download and tells you which ones to replace.

### Run

Claude picks a skill up automatically when your request matches it, for example:

- *"I want to plan a new feature before coding it"* → project-specs
- *"How should we check that this is correct?"* → project-verifier
- *"Help me set up CLAUDE.md and permissions for this repo"* → project-environment

In Claude Code you can also call one directly: `/project-specs`, `/project-verifier`, `/project-environment`.

### Suggested order for a new project

1. **project-specs**: define the goal and the tasks.
2. **project-verifier**: define how each task is checked, building on the validations agreed in the specs.
3. **project-environment**: set up the workshop around those choices. Its connectors, subagents (e.g. the critic)
   and hooks (e.g. automated checks) come from the specs and the verifier, and `CLAUDE.md` points to both.

Then build task by task. For each later feature, run project-specs and project-verifier again: they read what
already exists and extend it instead of starting over. Re-run project-environment only when those changes call for
new connectors, subagents, hooks or rules.
