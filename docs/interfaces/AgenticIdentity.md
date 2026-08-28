[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / AgenticIdentity

# Interface: AgenticIdentity

Defined in: [types.ts:67](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L67)

An agentic identity (SPEC §1–§4).

The capability-bearing fields (`tier`, `custody`, `verified`, `funded`) gate outward
action via [canActOutward](../functions/canActOutward.md). They MUST be non-forgeable at the trust boundary where
the gate is enforced — re-load the identity from your store of record, never trust a
caller-supplied or deserialized object (SPEC §5).

## Properties

### custody

> **custody**: `"platform"` \| `"self"`

Defined in: [types.ts:73](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L73)

Who holds the nsec — `platform` or `self` (SPEC §2).

***

### funded?

> `optional` **funded?**: `boolean`

Defined in: [types.ts:81](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L81)

Whether the identity is funded. A capability-bearing field (SPEC §5).

***

### npub

> **npub**: `string`

Defined in: [types.ts:69](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L69)

The self-custodied Nostr public key, bech32-encoded (SPEC §1). The stable anchor.

***

### profile

> **profile**: [`Profile`](Profile.md)

Defined in: [types.ts:75](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L75)

The identity's profile data (SPEC §3).

***

### tier

> **tier**: `"computed"` \| `"owned"`

Defined in: [types.ts:71](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L71)

The tier — `computed` (inert) or `owned` (can act outward) (SPEC §2).

***

### verified?

> `optional` **verified?**: `boolean`

Defined in: [types.ts:79](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L79)

Whether the identity has been verified. A capability-bearing field (SPEC §5).

***

### vhaiku?

> `optional` **vhaiku?**: [`Vhaiku`](Vhaiku.md)

Defined in: [types.ts:77](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L77)

Optional code-derived visualization reference (SPEC §4).
