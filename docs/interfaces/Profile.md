[**nostr-agentic-identity v0.2.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / Profile

# Interface: Profile

Defined in: [types.ts:39](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/types.ts#L39)

The identity's profile — its DATA, distinct from its visualization (SPEC §3).

Published as a Nostr kind-0 event signed by the identity's key. Owned identities
carry a NIP-05 binding on a domain under the holder's or its provider's control;
computed identities carry only a provider-scoped handle.

## Properties

### handle

> **handle**: `string`

Defined in: [types.ts:41](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/types.ts#L41)

The display handle. Provider-scoped for computed; NIP-05-bound for owned.

***

### nip05?

> `optional` **nip05?**: `string`

Defined in: [types.ts:43](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/types.ts#L43)

NIP-05 binding on a controlled domain. Present for `owned`, absent for `computed`.
