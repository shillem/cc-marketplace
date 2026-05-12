# Security Checklist

## Review Prompts

- Validate untrusted input for type, shape, range, and size
- Prefer parameterized queries and safe APIs over string-built commands or SQL
- Check output escaping or sanitization where untrusted content is rendered
- Verify authentication and authorization on sensitive operations and object-level access
- Watch tenant or account boundary checks in multi-user systems
- Ensure secrets are not committed, echoed, or logged
- Check sensitive data handling in logs, errors, storage, and transport
- Review file paths, uploads, downloads, and archive handling for traversal or unsafe processing
- Review outbound requests and callbacks for SSRF-style trust issues
- Check redirects, webhooks, cookies, sessions, tokens, and CORS settings when relevant
- Look for risky dependency or configuration changes, debug surfaces, and insecure defaults

## Review Guidance

Only raise a security finding when there is a plausible exploit path, missing control, or materially risky default. Keep the write-up concrete and evidence-based.
