[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / Vhaiku

# Interface: Vhaiku

Defined in: [types.ts:52](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L52)

A vhaiku — a visualization derived from the npub by code, NOT a hosted image (SPEC §4).

This package does not generate vhaikus; it only carries the reference. Generation is
performed by any deterministic, code-derived generator under the standard.

## Properties

### renders

> **renders**: `string`[]

Defined in: [types.ts:56](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L56)

Render variants (e.g. avatar, banner, mark), each code-derived — never hosted media.

***

### tokenId

> **tokenId**: `string`

Defined in: [types.ts:54](https://github.com/HumanjavaEnterprises/nostr-agentic-identity/blob/69edbe69a36544a2c334ed38748c434826825153/src/types.ts#L54)

Deterministic token identifying this render set (derived from the key).
