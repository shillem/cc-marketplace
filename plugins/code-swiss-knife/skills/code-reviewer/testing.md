# Testing Review Points

## Review Prompts

- Check whether new or changed behavior is covered by tests at an appropriate level.
- Verify the tests would fail without the change, not merely execute the happy path.
- Check edge cases, error paths, boundary conditions, and invalid inputs where relevant.
- For bug fixes, look for a regression test that reproduces the original failure mode.
- Ensure tests assert observable behavior rather than overly coupling to implementation details.
- Check whether the tests are deterministic and isolated from time, ordering, network, or shared-state flakiness.
- Review fixtures, factories, and test data for realism, clarity, and proper cleanup.
- Check negative cases, permission boundaries, and validation failures where relevant.
- Review snapshot, golden-file, or generated-output updates to confirm they reflect intentional behavior changes.
- Make sure critical user flows or release-sensitive paths have enough coverage to reduce change risk.

## Review Guidance

Flag missing or weak tests when they materially reduce confidence in correctness or safe release. Do not demand exhaustive coverage; focus on whether the most important behavior, failure modes, and regressions are meaningfully exercised.
