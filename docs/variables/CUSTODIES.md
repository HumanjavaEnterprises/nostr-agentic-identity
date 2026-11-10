[**nostr-agentic-identity v0.2.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / CUSTODIES

# Variable: CUSTODIES

> `const` **CUSTODIES**: readonly \[`"platform"`, `"self"`\]

Defined in: [types.ts:27](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/types.ts#L27)

Who custodies the identity's `nsec` (SPEC §2).

- `platform` — the holder never receives an nsec (computed identities).
- `self` — the nsec was handed to the holder once and never retained (owned identities).
