# Investigation

Investigators investigate and return candidates, not a verdict. Read complete changed functions and relevant surrounding context, then map changed entry points, contracts, branches, defaults, errors, side effects, async work, resource lifecycles, removed behavior, callers, tests, docs, schemas, configuration, and migrations. For staged-only targets, inspect the index versions of tracked files (`git show :path`, when present), not checkout contents with possible unstaged edits; inspect staged deletions in `HEAD:path`. Search beyond the diff for consumers. If the target is too large to inspect fully, prioritize security boundaries, public contracts, state changes, failure paths, and data integrity; report what remains uninspected.

Primary investigators and single-context reviewers read [Review cues](review-cues.md) and apply relevant sections: Runtime Behavior for `behavior`, Contracts and Security Boundaries for `contract`, Regression Protection for `test`, Structure and Ownership for `simplicity`, and Documentation and Release Surfaces for `documentation`. A broad review may use any applicable cue. Independent investigators use their own method; do not load or apply the primary review cues, even if this skill is available.

For risky changes, formulate specific candidates:

```text
Runtime or contract: Under [condition], the changed path does [behavior], producing [wrong result] for [affected party].
Regression protection: [Meaningful regression] can ship because [current controls do not detect it].
Maintenance or docs: [Current structural or guidance defect] is likely to cause [specific divergence, wrong change, or wrong user action].
```

Trace success, failure, boundary, repeated-execution, and compatibility paths. Ask whether an existing test would fail if changed behavior were removed or reversed; whether consumers, docs, config, fixtures, or generated output retain stale assumptions; and whether a change creates a second owner for a decision. Generate plausible candidates before deciding whether they meet the reporting bar.

Try to disprove each candidate by tracing guards, validation, cleanup, and ownership and inspecting relevant callers, tests, schemas, config, docs, migrations, and state owners. Return a compact change map, cross-cluster dependencies, candidates not refuted by inspection, unresolved material risks, and uninspected surfaces. For each candidate give location, scenario or risk, evidence, impact, focused fix, and a check that could settle it. Do not treat a polished explanation or a confidence label as evidence. The coordinator runs final verification and applies the reporting bar.
