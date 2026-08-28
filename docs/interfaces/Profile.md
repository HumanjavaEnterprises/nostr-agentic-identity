[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / Profile

# Interface: Profile

Defined in: types.ts:39

The identity's profile — its DATA, distinct from its visualization (SPEC §3).

Published as a Nostr kind-0 event signed by the identity's key. Owned identities
carry a NIP-05 binding on a paid anchor; computed identities carry only a free,
provider-scoped handle.

## Properties

### handle

> **handle**: `string`

Defined in: types.ts:41

The display handle. Free/provider-scoped for computed; paid for owned.

***

### nip05?

> `optional` **nip05?**: `string`

Defined in: types.ts:43

NIP-05 binding on a paid anchor. Present for `owned`, absent for `computed`.
