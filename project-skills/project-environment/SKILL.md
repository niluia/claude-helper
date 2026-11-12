---
name: project-environment
description: Guided workflow for setting up the environment Claude works in on a project, its workshop, covering CLAUDE.md (repo structure, Claude-related files, knowledge architecture and data-access rules, project lifecycle, working rules), permission rules and enforcement, connectors (MCP servers), subagents, hooks and automation, and skills and plugins management. Use this skill whenever the user wants to set up, configure, organize or review how Claude works in a project or repo, mentions CLAUDE.md, project instructions, permissions, settings.json, MCP servers or connectors, subagents, hooks, or managing skills, or is starting a new project with Claude Code, even if they don't say "environment". Complements the project-specs (blueprint) and project-verifier (quality control) skills.
---

# Project Environment

This skill helps the user set up the environment Claude works in. If the specs are the blueprint and the verifier is the quality control, the environment is the workshop: what Claude knows about the project from the start of every session, what it may and may not touch, which tools and systems it can reach, and what happens automatically. A well-set-up workshop prevents a whole class of mistakes before they happen, instead of catching them afterwards.

Work through the five steps in order, then finish with the wrap-up. The user may skip steps that don't apply, but offer each one.

## Working principles (apply throughout)

- **Interview, don't dictate.** For each topic, inspect the project first and propose concrete content based on what you found, so the user reacts rather than starts from scratch. Then go through it with the user, asking one question at a time and building on each answer.
- **Be precise.** Rules about what Claude may do must leave no room for interpretation. "Be careful with config" is not a rule; "Never modify files in `config/production/`" is.
- **Get explicit confirmation** before moving on and before writing or changing any file. A general "looks good" for a long list isn't confirmation of each item.
- **Never overwrite silently.** Review existing setup before proposing changes, and flag conflicts.
- **Enforce what must hold.** Instructions guide Claude; permissions and hooks actually block. Anything that must never happen gets both.

## Environment: Claude Code vs. Claude Project

Check which situation you're in before Step 1.

- **Claude Code:** read and write the configuration files directly, and test them in the session.
- **Claude Project (claude.ai):** the equivalent of `CLAUDE.md` is the project instructions, and the knowledge files play the role of the repo's docs. Permissions, hooks, subagents and project-level MCP configuration don't exist there, so for those steps, prepare the files for the user to add to their repo and explain where each goes. Produce everything as downloads and say which existing file each replaces.

---

## Step 1: Set up CLAUDE.md

`CLAUDE.md` is the workshop's standing orientation. It's loaded into every session, so it's where Claude learns what the project is, how to work in it, and where the blueprint and quality control live.

**1. Review what exists.** Check for an existing `CLAUDE.md` (at the project root or in `.claude/`), `CLAUDE.local.md`, files in `.claude/rules/`, and an `AGENTS.md` or other agents' config files. Summarize what's there and discuss with the user what to keep, improve or remove.

**2. Capture what the code reveals.** Gather what can be discovered from the repo: build, test, lint and run commands, project structure, and conventions visible in the code. Suggest the user run `/init`, which generates a starting `CLAUDE.md` from the codebase or suggests improvements to an existing one rather than overwriting it.

**3. Interview section by section.** For sections that already exist, discuss what to update.

- **a. Repo structure and how it works.** What the project is for, in two or three sentences; the main directories and what lives in each; how the parts fit together; how to install, build, run and test; setup the code doesn't show (required services, environment variables, local quirks).
- **b. Claude-related files.** Where Claude's own material lives and how it's managed: `CLAUDE.md` and any local or rules files, skills, subagents, hooks and settings in `.claude/`, connector configuration, the specs folder and the verifier document. For each, agree who may change it, e.g. Claude may propose edits to skills but applies them only with approval, and never edits settings files.
- **c. Knowledge architecture.** Where data lives and what Claude may do with it. For each location or type of data (source code, specs, test fixtures, config, secrets and `.env` files, generated output, databases, external systems), define precisely whether Claude may **read**, **change**, **create**, **move** or **delete** it, e.g. "Never read or modify `.env*` files" or "Files in `data/raw/` are read-only; write derived data to `data/processed/`". Also record what data Claude does *not* have access to, so it asks instead of guessing.
- **d. Project lifecycle.** If useful for this project, define how development is structured: phases (e.g. spec → build → verify → release), what must be true to move from one phase to the next, how progress is documented (where, in what format, when it's updated), and branching, commit and review conventions.

  **Project log.** As part of this section, ask the user whether they want to use the lab's project log to track the project's ideas and experiments, explaining briefly what it gives them: a short current status (`STATUS.md`), an append-only history of every step tried, accepted, discarded or superseded, with its numbers and reasons (`HISTORY.md`), notes and to-dos (`notes.md`), and an interactive tree of that history (`history_tree.html`) to review it at a glance. It comes from https://github.com/niluia/claude-helper (`Project-log/` folder). If the user wants it:
  1. Check whether a `project_log/` folder already exists. If not, ask which language template to use (`template_english/` or `template_italian/`), and with the user's agreement copy only that folder into the project as `project_log/` (in Claude Code, e.g. by cloning the repo to a temporary location and copying the template; in a Claude Project, ask the user to add the files). Never copy the example or docs folders.
  2. Read `project_log/README.md` and follow its setup: fill in `STATUS.md` and the title in `history_data.js`, and set the project leader (`leader`), asking the user who it is. Only the leader may mark a step as accepted.
  3. Add the pointer line to `CLAUDE.md`: "Project log in `project_log/` (status, history, notes): read `project_log/README.md` and follow its instructions."
  4. Integrate it with the lifecycle and working rules, agreeing each with the user:
     - Every experiment or attempt Claude runs is logged: when it starts, add a `run` section and node with `who` set to Claude (e.g. "Claude"); when it finishes, propose its outcome and record it as the README describes. Claude never marks a step `acc` on its own; it proposes and waits for the leader.
     - Decide which lifecycle events get a log entry, e.g. each task from the specs once validated, each verifier review that changes a decision, and each spec change made after a flagged issue.
     - Add the log's rules to the knowledge architecture (section c): `HISTORY.md` is append-only (corrections only, never deletions), `history_data.js` is updated together with `HISTORY.md`, `history_tree.html` is never edited, and results never go into `notes.md`.
  5. Remind the user they can review the history at any time by opening `history_tree.html` in a browser.
- **e. Working rules.** Rules Claude follows no matter what, such as using the project-specs skill before new features, running the verifier before marking work done, never changing specs or verification silently, and anything Claude has repeatedly got wrong in this project. Keep each rule short and unambiguous.
- **f. Anything else.** Ask the user what else matters to them that these sections don't cover.

**4. Keep it lean.** Every line loads in every session, so keep only what Claude needs most of the time in `CLAUDE.md`. Move long material (a full data-access table, a detailed lifecycle description) into separate files and point to them by path in backticks, discussing the split with the user. `@path` imports still load the imported file into every session, so use them only for short files Claude always needs. If the project already uses `AGENTS.md` for other coding agents, import it rather than duplicating it.

**5. Shared vs. personal.** `CLAUDE.md` is committed and shared, so keep it to project-level standards. Personal preferences go in `CLAUDE.local.md` (added to `.gitignore`) or the user's own `~/.claude/CLAUDE.md`.

**6. Enforce the strict rules.** For every rule from sections c and e that must never be broken, propose a matching enforcement and agree it with the user:
- **Permission rules** in `.claude/settings.json` (shared) or `.claude/settings.local.json` (personal, not committed): `deny` for actions never allowed (e.g. `Read(.env)`, `Read(./secrets/**)`), `ask` for actions needing approval each time (e.g. `Bash(git push *)`), `allow` for routine commands Claude may run freely (e.g. test and lint commands). Deny rules are checked first and can't be overridden by allow rules. Watch pattern shape: `Read(./.env)` covers only the current directory while `Read(.env)` matches at any depth, and a Read deny doesn't stop shell commands like `cat .env`, so cover the shell too for anything truly sensitive.
- **Hooks** for rules that permission patterns can't express precisely (designed in Step 4).

Mirror each enforced rule in `CLAUDE.md` in plain words, so Claude knows the rule and why it exists rather than discovering it by being blocked.

**7. Keep it current.** Add a working rule: when Claude notices something in `CLAUDE.md` is outdated, missing or contradicted by the code, it flags this and proposes an update rather than silently working around it. Agree with the user when the file gets a full review, e.g. at each lifecycle phase change.

**8. Auto memory.** Explain that Claude Code also keeps personal auto memory, notes Claude writes from the user's corrections. Agree how it relates to `CLAUDE.md`: anything that should apply to the whole team, or is a firm rule, gets promoted into `CLAUDE.md` (or into settings, if it needs enforcing), since auto memory is personal and not shared.

Show the draft, revise it with the user, and write it only after explicit confirmation. Testing happens in the wrap-up, once all steps are done.

## Step 2: Connectors (MCP servers)

Connectors give Claude access to systems outside the repo. Each one widens what Claude can see and do, so add them deliberately.

**1. Review what exists.** Check for configured MCP servers (e.g. a project-level `.mcp.json`, and the user's own configuration) and summarize them.

**2. Interview.** Go through these with the user, one question at a time:
- Which external systems does the work depend on? Typical ones: issue tracker, documentation or wiki, databases, design tools, CI, logs, monitoring and error tracking. Propose candidates based on the project, including any external feedback sources listed in the verifier document.
- For each connector: what Claude needs it for, and whether it needs only to read or also to write. Default to read-only and add write access only where there's a clear need.
- Which actions through a connector are sensitive (creating tickets, changing records, posting messages) and need approval each time?
- Is the connector shared with the team (project configuration) or personal?

**3. Enforce and document.** Express the agreed access in permission rules per connector tool (`mcp__<server>__<tool>`), using `deny` and `ask` as in Step 1. Add each connector to the knowledge architecture in `CLAUDE.md`: what it's for, what Claude may do through it, what it must not do. Never put credentials in committed files.

## Step 3: Subagents

Subagents are reusable specialist agents with their own instructions, tools and a fresh context. They keep the main session focused, and because they don't share the working context, they're less biased reviewers.

**1. Review what exists.** Check `.claude/agents/` (project) and the user's personal agents, and summarize them.

**2. Interview.** Go through these with the user, one question at a time:
- Which recurring jobs would benefit from a specialist? Propose candidates: the verifier's critic (if not yet saved as a subagent), a code reviewer, a test writer, a documentation checker, a security reviewer.
- For each one: its single job, what it receives as input, what it returns (prefer structured, criterion-by-criterion output for reviewers), and when it should be used.
- Which tools each one gets. Give each only what its job needs, e.g. a reviewer gets read-only tools.

**3. Write and document.** Draft each subagent definition, confirm it with the user, save it in `.claude/agents/` (or personally, if the user prefers), and list the subagents and when to use them in `CLAUDE.md`.

## Step 4: Hooks and automation

Hooks run commands automatically at set points in Claude's work, such as before or after a tool is used, or when Claude finishes responding. They turn "Claude should remember to" into "it always happens", and can block actions outright.

**1. Review what exists.** Check the hooks configured in the settings files, and existing automation such as formatters, pre-commit hooks and CI, so hooks complement rather than duplicate them.

**2. Interview.** Go through these with the user, one question at a time, proposing candidates:
- **Guard rails:** checks before an action that block it if it breaks a rule from Step 1, e.g. blocking edits outside allowed directories or to protected files.
- **Routine quality steps:** e.g. formatting or linting after every edit.
- **Verification:** automated checks from the verifier document, e.g. running the fast tests when Claude finishes a task.
- **Context:** e.g. loading current progress notes at the start of a session.

For each: what triggers it, exactly what it runs, what happens on failure (block, warn, or report back to Claude), and how long it may take. Keep hooks that run often fast; slow checks belong at task boundaries or in CI.

**3. Write, test and document.** Show the hook configuration and any scripts, confirm with the user, write them, and test each one by triggering it deliberately. Note what runs automatically in `CLAUDE.md`, so Claude understands why an action was blocked or a check ran.

Hooks run commands on the user's machine, so explain what each one does in plain words before adding it, and never add one the user hasn't explicitly approved.

## Step 5: Skills and plugins management

Skills package repeatable workflows (like this one); plugins bundle skills, subagents, hooks and connectors so they can be shared. Unmanaged, they drift: different team members end up with different versions.

**1. Review what exists.** Check project skills (`.claude/skills/`), the user's personal skills, and any installed plugins, and summarize them.

**2. Interview.** Go through these with the user, one question at a time:
- Which skills does this project rely on (e.g. project-specs, project-verifier, project-environment) and which recurring workflows could become new skills?
- Where does each live: in the repo, shared with the team and versioned with the code, or personal?
- How are skills changed? E.g. Claude may propose changes but the user approves them; changes go through normal code review; each change is noted with what changed and why.
- How does the team stay in sync? E.g. shared skills live only in the repo, or are distributed as a plugin.
- When are skills reviewed, e.g. when one produces poor results, or at each lifecycle phase change?

**3. Document.** Record the agreed approach in section b of `CLAUDE.md` (Claude-related files), and add any skills or plugin setup the user approved.

---

## Wrap-up: pull it together and test

1. **Check the whole workshop is consistent.** `CLAUDE.md` should point to the specs folder, the verifier document, the subagents, the connectors and the hooks, and the rules in `CLAUDE.md`, the permission settings and the hooks should agree with each other. Fix any mismatch with the user.
2. **Test the setup.** Have the user start a fresh session and ask Claude a few questions it should now answer correctly, drawn from Step 1, such as "Where do derived data files go?", "Can you read `.env`?" or "What do you do before marking a task done?". Wrong or vague answers show which part of `CLAUDE.md` needs rewriting. Then try one denied action to confirm enforcement works, and trigger one hook to confirm it runs.
3. **Summarize** what was set up, where each piece lives, and what runs automatically.
4. **Offer the companion skills** if they haven't been used yet: project-specs to define the blueprint, and project-verifier to define quality control.
