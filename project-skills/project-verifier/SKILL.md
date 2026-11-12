---
name: project-verifier
description: Guided workflow for defining "the verifier" of a project with the user, meaning exactly how Claude will check that its output is correct. Covers precise evaluation criteria, an independent critic (another model or a context-free agent), and external feedback such as running or deploying the code. Works for a new project, a new feature (including one specced with the project-specs skill), or a new test or check added to an existing project. Use this skill whenever the user wants to define how work will be verified, checked, validated, reviewed or tested, mentions evaluation criteria, quality checks, a critic or reviewer agent, a feedback loop, or what "done" or "good" should mean, even if they don't say "verifier".
---

# Project Verifier

This skill helps the user define the verifier: how Claude checks its own output. Claude's most costly mistakes are the ones it doesn't notice, because it judges the work with the same assumptions that produced it. A good verifier counters this with three things: criteria precise enough that "correct" isn't a matter of interpretation, a reviewer that doesn't share Claude's assumptions, and real-world feedback from running the work.

Follow the four steps in order, then finish with the wrap-up.

## Working principles (apply throughout)

- **Interview, don't dictate.** Draft proposals so the user has something concrete to react to, then go through them with the user, asking one question at a time and building on each answer.
- **Get explicit confirmation** before moving on to the next step and before writing anything. A general "looks good" for a long list isn't confirmation of each item in it.
- **Never change verification silently.** If something conflicts with existing checks, the specs or an earlier decision, flag it and discuss it with the user.
- **Fit the new into the existing.** Extend existing checks and documents rather than creating parallel ones.

## Environment: Claude Code vs. Claude Project

Check which situation you're in before Step 1, because it changes what you can do.

- **Claude Code (or any environment with direct access to the repo):** read and edit files directly, run commands, and launch subagents.
- **Claude Project (claude.ai):** you can read files in the project knowledge but can't write back to them, run the user's project, or launch another agent. Produce new or updated files as downloads and say which existing file each replaces. Where a step needs something you can't do (running a critic, running the code), prepare it for the user instead, such as a ready-to-paste critic prompt or the exact commands to run and what to send back.

---

## Step 1: Identify the work and review existing verification

Ask the user what they're working on:
- **A new project** that needs a verifier from scratch.
- **A new feature**, for example one just specced with the project-specs skill. In that case, read its specs (goal, tasks, checkpoints, validations) so the verification builds on what was already agreed rather than redefining it.
- **A new test or check** to add to an existing project.

Then look for verification already in place. Ask the user, and also check the project yourself for:
- a verifier document in the specs folder (e.g. `specs/verifier.md`);
- verification instructions in `CLAUDE.md`;
- test suites, linters, type checkers and formatters, and their configs;
- CI pipelines and build scripts (e.g. `package.json` scripts, `Makefile`, GitHub Actions);
- critic agent definitions (e.g. in `.claude/agents/`).

**If verification exists:** read it all and summarize it for the user: what's checked, how each check is run, and when. Then discuss how the new verification fits: which existing checks already cover it, what extends an existing layer, what's genuinely new, and any gaps, duplicates or conflicts you noticed. Propose a plan and get the user's confirmation before continuing.

**If nothing exists:** say so, propose where the verifier will live (e.g. `specs/verifier.md` alongside the other specs), and confirm with the user.

## Step 2: Set precise evaluation criteria

Work with the user to set the evaluation criteria that will ensure a high-quality final output, and make them precise. Vague criteria are the main source of Claude getting things wrong while believing it got them right, so leave as little room for interpretation as possible.

**1. Draft.** Outline a first set of criteria yourself, drawing on the goal, the specs and their per-task validations, the type of output (code, tests, docs, data, UI) and the project's existing conventions. Group them by output. Show the draft briefly so the user sees the overall shape, but treat it as a starting point for discussion, not a proposal to approve.

**2. Interview.** Go through the draft with the user one group at a time, asking one question at a time. For each group:
- Check each criterion is right and matters to the user.
- Ask what's missing: expectations the user has that the draft doesn't capture.
- Ask what matters most, so must-haves are distinguished from nice-to-haves. Must-haves block a task from being marked done; nice-to-haves are reported but don't block.
- Probe anything vague until it's precise.

When the user gives a vague criterion, don't just ask them to be more precise. Propose a concrete interpretation ("By 'well tested', do you mean every public function has at least one unit test, and each edge case listed in the spec has a test?") and let them confirm or correct it. Watch for words such as "good", "clean", "fast", "robust", "user-friendly", "appropriate" and "properly", and resolve each one.

Every criterion in the final list must be:
- **Specific:** it names exactly what must be true.
- **Checkable:** there's a clear way to tell whether it's met.
- **Unambiguous:** two people judging the same output independently would reach the same pass/fail verdict.

For example:
- Vague: "Make this report look good." Precise: "The report has 3 sections, each ending with a recommendation."
- Vague: "The API should be fast." Precise: "The `/search` endpoint responds in under 200 ms for queries returning up to 100 results."
- Vague: "The code should be clean." Precise: "The linter passes with zero warnings, and no function exceeds 50 lines."

If a criterion genuinely can't be made objective (e.g. visual taste), say so and mark it as needing the user's judgment.

For each criterion, also note how it will be checked (a command, a test, the critic, external feedback, or the user) and when.

**3. Confirm.** Read the final list back group by group and get explicit confirmation of each group before continuing.

## Step 3: Set up an independent critic

Agree with the user on a second reviewer that checks the work independently. Claude reviewing its own output tends to share the assumptions that produced it, so a reviewer without Claude's working context is more likely to catch mistakes Claude can't see.

**Choose the critic.** Ask the user which reviewers they have access to, then discuss the options and confirm which to use:
- **A different model** (any model or coding tool the user has available, e.g. a CLI agent from another provider). It gives a genuinely different perspective, since a different model has different blind spots. Check with the user how it can be called from their environment and what it costs them to run.
- **A fresh Claude agent without the working context**, e.g. a subagent in Claude Code. No extra setup or subscription is needed; it shares Claude's general tendencies but not the assumptions built up during the work.
- **Both**, for high-stakes outputs.

**Define what the critic receives.** The output, the evaluation criteria from Step 2 and the relevant specs, and nothing else. Don't pass the working conversation, Claude's reasoning or Claude's own assessment of the output, since that would reintroduce the bias the critic is meant to avoid.

**Define what the critic is asked.** For each criterion: pass or fail, with specific evidence (a file and line, a failing command, a quoted section). Also ask it to flag problems the criteria don't cover. A criterion-by-criterion verdict is far more useful than a general opinion.

**Define when it runs.** E.g. at each task checkpoint, before a task is marked done, or only for must-have criteria. Running it on every small change is usually too slow and costly.

**Define how disagreements are handled.** When the critic disagrees with Claude, don't argue it away or silently accept it. Report the disagreement to the user with both positions and the evidence, and let the user decide. If Claude and the critic repeatedly disagree about a criterion, the criterion is probably still too vague; go back and tighten it with the user.

Record the choice, how to invoke the critic, and its instructions in the verifier document. In Claude Code, a Claude critic can be saved as a reusable subagent in `.claude/agents/` so it behaves the same way every time. In a Claude Project, offer to write a ready-to-paste critic prompt the user can run in a fresh chat or another model.

## Step 4: Pull in external feedback

Define how real-world signals feed into verification, so Claude checks the work against how it actually behaves, not just how it reads. Reading code and passing a critic's review can't fully show that something works; running it can.

**Choose the sources.** Propose the ones that fit the project and discuss them with the user, one at a time. Typical options:
- **Running the code:** executing the app, scripts or a CLI with realistic inputs and checking the output.
- **Preview or staging deployments:** deploying somewhere safe and checking the deployed behavior.
- **CI results:** the full pipeline, including checks that don't run locally.
- **Browser or end-to-end checks:** driving the UI, taking screenshots, checking user flows.
- **Logs, monitoring and error tracking:** errors, warnings and performance after running or deploying.
- **Benchmarks:** measured numbers for performance criteria.
- **People:** review from real users, stakeholders or teammates, for criteria that need human judgment.

**For each chosen source, define:**
- how Claude accesses it: the exact command, script, tool or connector, or what the user must run and send back;
- when it's used: e.g. at each checkpoint, before marking a task done, or after a deployment;
- which criteria from Step 2 it checks, and what counts as a pass.

**Safety.** Anything with side effects outside the local environment (deploying, sending messages, touching shared data, spending money) needs the user's explicit approval each time unless the user has explicitly set a standing rule. Prefer previews and staging; never touch production without explicit permission.

**Close the loop.** External feedback is only useful if it changes something:
- Flag any finding that fails a criterion or reveals a new problem, and discuss with the user what to change and how. Apply changes only once the user agrees.
- If feedback shows a criterion was wrong, missing or too vague, update the criteria with the user.
- Record recurring problems and their fixes under "Lessons learned" in the verifier document, and check that section at the start of future work, so the same mistakes aren't repeated.

---

## Wrap-up: write and activate the verifier

1. **Write the verifier document** in the agreed location, using the structure below (adapted to what was agreed), extending the existing document if there is one.
2. **Activate it.** A verifier that isn't consulted is useless. In Claude Code, propose adding a short pointer to `CLAUDE.md` (which is loaded in every session), e.g. "Before marking any task done, run the checks in `specs/verifier.md` and report results against its criteria." Add it only with the user's agreement. In a Claude Project, suggest adding a similar line to the project instructions.
3. **Review with the user.** Walk through the document, confirm each section explicitly, and summarize: what's checked, by whom or what, when, and where it's saved.

### Verifier document structure

```markdown
# Verifier: <project or feature>

## Scope
What this verifier covers (project, feature, or specific outputs).

## Evaluation criteria
### <Output, e.g. API>
| # | Criterion | Must/Nice | How checked | When |
|---|-----------|-----------|-------------|------|

## Automated checks
| Check | Command | When |
|-------|---------|------|

## Critic
- Reviewer: ...
- How to invoke: ...
- Receives: output, criteria, relevant specs (no working context)
- Runs: ...
- Disagreements: reported to the user with evidence

## External feedback
| Source | How accessed | When | Criteria checked | Needs approval? |
|--------|--------------|------|------------------|-----------------|

## Reporting
How results are reported, and what blocks a task from being marked done.

## Lessons learned
Recurring problems found by verification, and how they were fixed.
```
