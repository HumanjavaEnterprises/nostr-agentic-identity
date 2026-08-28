/**
 * nostr-agentic-identity — the thin conformance primitive for the agentic identity standard.
 *
 * The authoritative standard is SPEC.md. This package ships the types, the act-outward gate
 * predicate (§5), and a pure structural conformance checker — nothing heavy. It does not mint
 * keys, talk to relays, render vhaikus, or log anyone in.
 *
 * @packageDocumentation
 */
export { TIERS, CUSTODIES, type Tier, type Custody, type Profile, type Vhaiku, type AgenticIdentity, } from './types.js';
export { canActOutward } from './gate.js';
export { isConformant, describeStandard, type ConformanceResult, type StandardElement, } from './conformance.js';
