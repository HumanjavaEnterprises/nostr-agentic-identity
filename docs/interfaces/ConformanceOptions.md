[**nostr-agentic-identity v0.2.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / ConformanceOptions

# Interface: ConformanceOptions

Defined in: [conformance.ts:14](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/conformance.ts#L14)

Options for [isConformant](../functions/isConformant.md).

## Properties

### looseNpub?

> `optional` **looseNpub?**: `boolean`

Defined in: [conformance.ts:19](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/73045671d22ec705149ba235d43625dc74559066/src/conformance.ts#L19)

Opt back into the 0.1.x rule for SPEC §1: accept any non-empty `npub` string without
checking that it is a bech32 npub. Default `false` (the npub is validated).
