[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / CUSTODIES

# Variable: CUSTODIES

> `const` **CUSTODIES**: readonly \[`"platform"`, `"self"`\]

Defined in: types.ts:27

Who custodies the identity's `nsec` (SPEC §2).

- `platform` — the holder never receives an nsec (computed identities).
- `self` — the nsec was handed to the holder once and never retained (owned identities).
