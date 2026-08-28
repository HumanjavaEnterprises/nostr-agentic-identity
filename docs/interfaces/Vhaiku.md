[**nostr-agentic-identity v0.1.0**](../README.md)

***

[nostr-agentic-identity](../globals.md) / Vhaiku

# Interface: Vhaiku

Defined in: types.ts:52

A vhaiku — a visualization derived from the npub by code, NOT a hosted image (SPEC §4).

This package does not generate vhaikus; it only carries the reference. Generation is a
reference implementation (`vhaiku`) that lives under the standard.

## Properties

### renders

> **renders**: `string`[]

Defined in: types.ts:56

Render variants (e.g. avatar, banner, mark), each code-derived — never hosted media.

***

### tokenId

> **tokenId**: `string`

Defined in: types.ts:54

Deterministic token identifying this render set (derived from the key).
