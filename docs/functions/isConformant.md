[**nostr-agentic-identity v0.2.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / isConformant

# Function: isConformant()

> **isConformant**(`id`, `options?`): [`ConformanceResult`](../interfaces/ConformanceResult.md)

Defined in: [conformance.ts:54](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/conformance.ts#L54)

Check an identity against the structural rules of the standard (SPEC §1–§5).

This is a **pure, structural** check — no I/O, no network. It verifies the shape and the
tier/custody invariants; it does NOT verify that the `npub` is a point on the curve, that a
NIP-05 resolves, or that funds exist. Those are runtime concerns for the reference
implementations under the standard.

Rules enforced:
- `npub` is a lowercase bech32 `npub` with a valid checksum and a 32-byte payload (SPEC §1).
  Pass `{ looseNpub: true }` to fall back to the 0.1.x non-empty-string rule.
- `tier` is one of [TIERS](../variables/TIERS.md) and `custody` is one of [CUSTODIES](../variables/CUSTODIES.md) (SPEC §2).
- `profile.handle` is a non-empty string (SPEC §3).
- `owned` ⇒ `custody === 'self'`; `computed` ⇒ `custody === 'platform'` (SPEC §2).
- `owned` ⇒ a NIP-05 is bound; `computed` ⇒ no NIP-05 (SPEC §3).
- `vhaiku`, if present, has a non-empty `tokenId` and a non-empty `renders` array (SPEC §4).

Note on SPEC §5: a computed identity's structural inertness (it can never pass
[canActOutward](canActOutward.md)) is *guaranteed by construction* — the `platform`-custody rule below,
combined with `canActOutward` requiring `owned` + `self`, means no conformant computed identity
can act outward. There is therefore no separate reachable check for it here.

Only **own** properties of `id`, its `profile`/`vhaiku`, and `options` are read; inherited
values (a prototype, a polluted `Object.prototype`) count as missing.

Never throws: `null`, non-objects, and objects with throwing getters return `ok: false` with
at least one issue.

## Parameters

### id

[`AgenticIdentity`](../interfaces/AgenticIdentity.md)

the identity to check

### options?

[`ConformanceOptions`](../interfaces/ConformanceOptions.md)

see [ConformanceOptions](../interfaces/ConformanceOptions.md)

## Returns

[`ConformanceResult`](../interfaces/ConformanceResult.md)

`{ ok, issues }`
