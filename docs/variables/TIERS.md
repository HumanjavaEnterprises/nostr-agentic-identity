[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / TIERS

# Variable: TIERS

> `const` **TIERS**: readonly \[`"computed"`, `"owned"`\]

Defined in: [types.ts:16](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L16)

The two tiers an identity may hold (SPEC §2).

- `computed` — platform-derived, structurally inert (can never act outward).
- `owned` — freshly minted, self-custodied (can act outward when funded + verified).
