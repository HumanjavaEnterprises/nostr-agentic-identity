[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / isConformant

# Function: isConformant()

> **isConformant**(`id`): [`ConformanceResult`](../interfaces/ConformanceResult.md)

Defined in: [conformance.ts:35](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/conformance.ts#L35)

Check an identity against the structural rules of the standard (SPEC §1–§5).

This is a **pure, structural** check — no I/O, no crypto, no network. It verifies the shape
and the tier/custody invariants; it does NOT verify that the `npub` is a real key, that a
NIP-05 resolves, or that funds exist. Those are runtime concerns for the reference
implementations under the standard.

Rules enforced:
- `npub` is a non-empty string (SPEC §1).
- `tier` is one of [TIERS](../variables/TIERS.md) and `custody` is one of [CUSTODIES](../variables/CUSTODIES.md) (SPEC §2).
- `profile.handle` is a non-empty string (SPEC §3).
- `owned` ⇒ `custody === 'self'`; `computed` ⇒ `custody === 'platform'` (SPEC §2).
- `owned` ⇒ a NIP-05 is bound; `computed` ⇒ no NIP-05 (SPEC §3).
- `vhaiku`, if present, has a non-empty `tokenId` and a non-empty `renders` array (SPEC §4).

Note on SPEC §5: a computed identity's structural inertness (it can never pass
[canActOutward](canActOutward.md)) is *guaranteed by construction* — the `platform`-custody rule below,
combined with `canActOutward` requiring `owned` + `self`, means no conformant computed identity
can act outward. There is therefore no separate reachable check for it here.

## Parameters

### id

[`AgenticIdentity`](../interfaces/AgenticIdentity.md)

the identity to check

## Returns

[`ConformanceResult`](../interfaces/ConformanceResult.md)

`{ ok, issues }`
