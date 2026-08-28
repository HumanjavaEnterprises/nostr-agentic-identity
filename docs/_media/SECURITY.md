# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| CVSS v3.0 | Supported Versions                        |
| --------- | ---------------------------------------- |
| 9.0-10.0  | Releases within the last 6 months        |
| 4.0-8.9   | Most recent release                      |

## A note on this package's threat model

`nostr-agentic-identity` is a **checker, not an enforcer**. Its exports (`canActOutward`,
`isConformant`) are pure functions over a plain object you supply. They are only as trustworthy as the
object you feed them: the capability-bearing fields (`tier`, `custody`, `verified`, `funded`) MUST be
non-forgeable at the trust boundary where you enforce the gate. Re-load the identity from your store of
record and evaluate it there — never gate an outward action on a caller-supplied or freshly-deserialized
identity object (see SPEC §5). This package has zero runtime dependencies.

## Auth posture the standard mandates (SPEC §6)

The gate is only half the security model; the door is the other half. A conforming implementation of the
standard MUST provide **passwordless-always** access — magic link, QR bearer, or passkey; **never a stored
password**. Auth and intake responses MUST be **enumeration-safe**: identical for a known and an unknown
subject, so an attacker cannot probe which identities exist. And sessions MUST **re-load the identity from
the store of record on every request** rather than trusting a long-lived cached capability, so that
revocation (and any change to the `verified`/`funded`/`custody` fields the gate reads) takes effect
immediately. This package does not implement auth — §6 is out of scope for the thin conformance primitive —
but any system that composes it into a login or session flow is only conformant, and only safe, if it holds
this posture. See SPEC §6 and the reference `nostr-*` auth family.

## Reporting a Vulnerability

Please report security vulnerabilities through GitHub's Security Advisory feature at [https://github.com/humanjavaenterprises/nostr-agentic-identity/security/advisories/new](https://github.com/humanjavaenterprises/nostr-agentic-identity/security/advisories/new).

The team will acknowledge your report within 48 hours, and will send a more detailed response within 72 hours indicating the next steps in handling your report.

After the initial reply to your report, the security team will endeavor to keep you informed of the progress towards a fix and full announcement, and may ask for additional information or guidance.

## Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process.

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a pull request.
