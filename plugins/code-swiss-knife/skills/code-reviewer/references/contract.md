# Contract Scope

Own boundary promises: public surfaces, schemas, types, permissions, storage formats, config, external integrations, and invariants. A contract defect exists when a caller, stored record, integration, user, or maintainer can create or observe a state the boundary should prevent.

Report broad types, casts, defaults, or optional fields only when they let invalid state cross a boundary or make a real consumer likely to misuse it. Sensitive-data issues are in scope when a boundary permits, stores, transmits, exposes to third parties, or fails to reject/redact them. Runtime-only disclosure through logs, errors, telemetry, diagnostics, or user-visible output is outside this scope unless it is caused by a boundary/control failure.

## High-Yield Targets

Start with changed contract surfaces:

- Public APIs, request/response payloads, CLI flags, exported functions, events, hooks, callbacks, and plugin interfaces
- Data models, schemas, validators, serializers, deserializers, migrations, storage formats, generated types, and config files
- Required vs optional fields, defaults, nullability, enum/status values, versioning, and unknown/future values
- Authorization, tenant/account boundaries, object ownership, sensitive operations, and permission inheritance
- Untrusted input validation for type, shape, range, size, encoding, and allowed values
- Injection and unsafe construction boundaries: SQL/command/path strings, output escaping, unsafe deserialization, sandboxing, and archive/upload/download handling
- Network, session, and boundary security: SSRF, redirects, webhooks, cookies, sessions, tokens, CORS, secret handling, and sensitive data persisted, transmitted, exposed to third parties, or accepted across trust boundaries
- External integrations, environment assumptions, dependency/platform requirements, feature flags, and runtime capabilities
- Risky dependency or configuration changes, exposed debug surfaces, and insecure defaults
- Type definitions using broad `any`/dynamic shapes, excessive optionality, unchecked casts, ad-hoc objects, or parser round-trips
- Generated schemas/types/docs/migrations that must be updated from the correct source of truth

## Review Questions

Ask these before accepting the contract:

- Is the changed surface public, persisted, external, or internal?
- Does this change require backward compatibility, migration, versioning, or release guidance?
- Which existing caller, stored record, config, serialized payload, or external integration could now break?
- Can invalid state be constructed, parsed, persisted, serialized, or mutated after validation?
- Is a required field only documented as required, or is it enforced at the boundary?
- Does the type/schema make illegal states impossible, or merely inconvenient?
- Are permissions and other security controls checked at the boundary that matters, or assumed by an inner caller?
- Can untrusted data reach SQL, commands, file paths, rendered output, deserialization, redirects, webhooks, or outbound requests without validation, escaping, or parameterization?
- Are secrets or sensitive data exposed through source/config, persistence, transport, third-party calls, or a boundary that should reject or redact them?
- What happens with old data, missing fields, unknown enum values, stale config, or newer external payloads?
- Are defaults safe and explicit, or do they hide missing/invalid input?

## Inspect

1. List changed contracts and affected consumers: callers, exports, storage, config, jobs, tests, docs, generated code, and integrations.
2. Identify invariants that must hold before and after the change.
3. Check enforcement at construction, parse, validation, mutation, authorization, serialization, and persistence boundaries.
4. Check compatibility with old callers/data and unknown or future values.
5. Check generated artifacts and docs against their source of truth.
6. Look for duplicated validation or scattered normalization that shows the invariant has no single owner.

## Report

Report contract findings when:

- a consumer can break from the changed shape or semantics,
- invalid state can cross a boundary,
- authorization, tenant isolation, ownership, or another security boundary can be weakened,
- old data/config/integrations can fail without an intentional migration path, or
- future maintainers are likely to misuse the boundary because the invariant is not expressed or enforced.

For each finding, name the boundary, the invalid or incompatible state, the affected consumer, and the boundary-level fix. If compatibility expectations are unclear, ask explicitly.
