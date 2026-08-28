[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / canActOutward

# Function: canActOutward()

> **canActOutward**(`id`): `boolean`

Defined in: gate.ts:22

The act-outward gate (SPEC §5) — the one load-bearing predicate of the standard.

An identity may perform an **outward** action (send email, place a call, publish on its
behalf) **only when** it is `owned` + `self`-custody + `verified` + `funded`. A `computed`
identity is structurally unable to pass — it is never `owned`, never `self`-custody — so the
free tier can be *seen and reached* but never *acts*.

This single predicate is simultaneously the commercial gate (own it to act) and the abuse
filter (an unfunded, unverified stranger cannot send or call).

The comparison is strict (`===`): a truthy-but-non-`true` value (`1`, `'yes'`) does NOT pass.
The capability-bearing fields MUST be non-forgeable at the trust boundary — call this on an
identity re-loaded from your store of record, never on a caller-supplied or deserialized
object.

## Parameters

### id

[`AgenticIdentity`](../interfaces/AgenticIdentity.md)

the identity to evaluate

## Returns

`boolean`

`true` only for `owned` + `self` + `verified === true` + `funded === true`
