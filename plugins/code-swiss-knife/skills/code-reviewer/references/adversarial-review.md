# Adversarial Review

The coordinator prepares a neutral target package before investigating candidate defects. Require the user to identify how to invoke an available independent-review capability, including any requested provider, model, effort, or constraints; ask when invocation details are insufficient. Invoke a named capability using its own documented contract and pass user parameters unchanged. The coordinator can prepare a short internal handoff but does not print it in the final review unless invocation fails and a manual retry is needed.

Launch at least two blind investigations in separate contexts, preferably concurrently when the harness supports it: a primary investigator using [Investigation](investigation.md) and the applicable [Review cues](review-cues.md), and an independent investigator using its own method. A named capability may be an external CLI or a separate agent context; do not claim distinct methodology simply because the contexts differ. If the independent investigator loads this skill, its assigned independent role takes precedence: it must not apply the primary review cues. Prompt-level separation cannot prevent filesystem access.

Give both the same neutral facts: target, base, pinned revision if available, review root or retrievable patch and sufficient surrounding context, changed files, observable change scope rather than rationale, requested focus, and user constraints. Never pass one investigator the other's candidates, suspected locations, severities, verdict, or reasoning. An external reviewer without access to the review root must receive sufficient context to follow relevant callers and paths; otherwise stop and explain the material limitation before claiming an adversarial result.

For generic investigators without a capability-specific invocation contract, use this task shape. Supply the primary with the absolute investigation and cues paths on a shared filesystem or relevant sections inline when remote. Supply the independent investigator with `Use your own investigation method; do not read or apply the primary review cues` instead. If its capability defines an invocation contract, follow that contract while preserving the role, neutral target facts, and blindness:

```text
You are a [primary / independent] investigator in a blind review, not the coordinator. Investigate independently and return candidates, not a verdict. Do not dispatch, synthesize, or contact other reviewers.

Target: [target]
Base/range: [base, range, or none]
Pinned revision: [commit, if applicable]
Review root: [path, including assigned worktree when applicable]
Changed files: [files]
Change scope: [observable scope, no rationale or suspected defects]
User focus: [focus or broad]
User constraints: [constraints]
Review guidance: [investigation path plus review-cues path or inline sections for primary; own method for independent]
Patch and context: [inline when target cannot be retrieved from review root]

Inspect the target and nearby code. For staged-only targets, read tracked files from the index (`git show :path`, when present), not checkout contents with possible unstaged edits; inspect staged deletions in `HEAD:path`. Return coverage, every candidate you cannot refute, unresolved material risks, and uninspected surfaces. For each candidate include location, scenario or risk, evidence, impact, focused fix, and any verification command that could settle it. List checks run and their results. Do not request another investigator's findings.

Do not edit the code being reviewed or create worktrees. For working-tree targets, inspect only. In a coordinator-provisioned worktree pinned to a committed target, run non-destructive checks only when they cannot interfere with other investigators through shared state; otherwise return the command for coordinator verification. Do not switch branches or remove the assigned worktree.
```

If two investigations cannot run, including when the independent capability times out or lacks sufficient target access, stop and explain the failure. Offer retry or an explicitly labelled non-adversarial review; do not silently issue an adversarial verdict. If the user named an unavailable reviewer, provider, model, effort, or capability, obtain agreement before substituting it.

After both return, the coordinator audits coverage, verifies candidates, deduplicates by root cause, resolves disagreements against repository evidence, checks interactions, and produces one combined report rather than two reviews side by side. Do not conduct a third systematic hunt. Keep disagreement only when evidence cannot resolve it and it could change the assessment.
