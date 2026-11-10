[**nostr-agentic-identity v0.2.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / canActOutward

# Function: canActOutward()

> **canActOutward**(`id`): `boolean`

Defined in: [gate.ts:30](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/gate.ts#L30)

The act-outward gate (SPEC §5) — the single rule this standard enforces.

An identity may perform an **outward** action (send email, place a call, publish on its
behalf) **only when** it is `owned` + `self`-custody + `verified` + `funded`. A `computed`
identity is structurally unable to pass — it is never `owned`, never `self`-custody — so an
identity no one has vouched for can be *seen and reached* but never *acts*.

This predicate is an authorization and abuse-control boundary: `verified` and `funded` are
what make outward action attributable and costly. The standard does not prescribe how an
implementation establishes either signal.

The comparison is strict (`===`): a truthy-but-non-`true` value (`1`, `'yes'`) does NOT pass.
The capability-bearing fields MUST be non-forgeable at the trust boundary — call this on an
identity re-loaded from your store of record, never on a caller-supplied or deserialized
object.

Only **own** properties are read: a field inherited from a prototype (including a class
instance's prototype getter, or a polluted `Object.prototype`) does not count.

Never throws: `null`, `undefined`, arrays, non-objects, and objects whose fields cannot be read
return `false`.

## Parameters

### id

[`AgenticIdentity`](../interfaces/AgenticIdentity.md)

the identity to evaluate

## Returns

`boolean`

`true` only for `owned` + `self` + `verified === true` + `funded === true`
