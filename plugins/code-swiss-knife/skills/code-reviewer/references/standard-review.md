# Standard Review

Prefer a fresh primary investigator for every review when delegation is available, including small, tightly coupled changes. For separable file, subsystem, or execution-path clusters, delegate parallel investigations; do not split solely by review focus. Assign every changed file to one cluster, keep related implementation, tests, docs, configuration, generated artifacts, and migrations together where practical, and identify cross-cluster dependencies. Delegates may follow callers and consumers outside assigned files. If delegation is unavailable, perform a single-context investigation and disclose that in the final review; no confirmation is needed unless the user explicitly required separate contexts.

Supply the absolute path to `investigation.md` and `review-cues.md` for investigators on a shared filesystem. For a remote primary investigator without access to those paths, include the relevant investigation guidance and cues inline. Do not depend on automatic skill loading: its availability does not imply that the delegate has read either reference. The role assignment takes precedence if the delegate independently loads `SKILL.md`.

Use this task shape for each primary investigator:

```text
You are a primary investigator for a standard code review, not the coordinator. Return candidates, not a final verdict. Do not dispatch, synthesize, or switch branches.

Target: [target]
Base/range: [base, range, or none]
Pinned revision: [commit, if applicable]
Review root: [path, including assigned worktree when applicable]
Assigned files: [files, or whole change]
Related context: [known callers, consumers, or dependencies; neutral facts only]
Change scope: [observable scope, not suspected defects]
User focus: [focus or broad]
Investigation guidance: [absolute path or inline content]
Review cues: [absolute path or relevant sections inline]
Patch: [inline patch when target cannot be retrieved from review root]

Read the investigation guidance and review cues; inspect relevant nearby code and follow callers and effects outside the assigned files. Return coverage, a change map, cross-cluster dependencies, every candidate not refuted by inspection, unresolved material risks, and uninspected surfaces. For each candidate include location, scenario or risk, evidence, impact, focused fix, and a command that could settle it. List any checks you ran and their results.

Do not edit the code being reviewed or create worktrees. For working-tree targets, inspect only: the coordinator runs checks after you finish. In an assigned, coordinator-provisioned worktree pinned to a committed target, you may run non-destructive checks only when they cannot conflict with other investigators through shared state; otherwise return the proposed command to the coordinator. Do not change branches or remove the assigned worktree; the coordinator owns cleanup and final verification.
```

The coordinator audits the returned coverage against the target even if there are no candidates; redispatch when material surfaces were missed. For especially important or uncertain candidates, another investigator can attempt refutation by inspection and return `not refuted`, `refuted`, or `unresolved` with evidence. The coordinator verifies and decides whether to report.
