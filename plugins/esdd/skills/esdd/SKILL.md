---
name: esdd
description: Express Spec-Driven Development for project setup, domain documentation, planning, implementation, revision, verification and archiving. Use only when the user asks for ESDD, references an ESDD command or artifact, or follows up on an existing ESDD change.
argument-hint: "[init|document|explore|new|continue|apply|verify|archive|view] [...]"
---

1. Treat the first word as `$ACTION`, remainder as `$REST`.
2. With no input, or input that is neither an action nor a follow-up on a change, show help and stop.
3. For a valid action, read its reference to interpret `$REST`.
4. Run the init gate, except for `explore`.
5. For `continue`, `apply`, `verify`, `archive` and follow-ups, select the change `<name>`.
6. Follow the action's instructions, or for a conversational follow-up, run `node <skill-dir>/scripts/cli.mjs status "<name>" --apply` and read the affected artifacts and code.

## Init Gate

Run `node <skill-dir>/scripts/cli.mjs init --status`:

- If uninitialized and `$ACTION` is not `init`, suggest `/esdd init` and stop.
- If initialized and `$ACTION` is `init`, report that and stop.

## Select the Change

- Use the named change, then the one established in conversation. Otherwise, run `node <skill-dir>/scripts/cli.mjs list` and use the only relevant open change; ask if several are plausible.
- If none exist, report and stop; suggest `/esdd new` for planning or implementation requests.
- If added scope could extend the current change or start another, ask which unless already clear.

## Working Rules

Actions may further restrict edits.

- Edit when the user asks for changes, including during discussion or review; the request covers the routine fixes and checks needed to finish it. Finishing a phase does not start the next one unless the user asked for it.
- Use [revision](references/shared-revision.md) for artifact corrections before changing code that depends on them.
- Write artifacts as first drafts. When correcting one, rewrite each affected section as it would read if the current target had been known from the start; a reader who never saw the earlier version finds no trace of it. State the target positively and keep a negative only where it marks a real boundary, such as a non-goal. Repair details stay in the conversation or subagent handoff.
- Correct authorized code against the agreed target. Remove abandoned code within scope and preserve unrelated work. Code corrections need neither unchecked groups nor `/esdd apply`.
- Check tasks only when implementation and relevant verification satisfy their outcomes; uncheck unmet ones. Run relevant tests and build/type checks after code corrections.

## Action References

- [init](references/init.md)
- [document](references/document.md)
- [explore](references/explore.md)
- [new](references/new.md)
- [continue](references/continue.md)
- [apply](references/apply.md)
- [verify](references/verify.md)
- [archive](references/archive.md)
- [view](references/view.md)
- [help](references/help.md)
