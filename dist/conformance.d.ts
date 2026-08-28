import { type AgenticIdentity } from './types.js';
/** The result of a structural conformance check. */
export interface ConformanceResult {
    /** `true` when there are no structural issues. */
    ok: boolean;
    /** Human-readable descriptions of every structural rule the identity violates. */
    issues: string[];
}
/**
 * Check an identity against the structural rules of the standard (SPEC §1–§5).
 *
 * This is a **pure, structural** check — no I/O, no crypto, no network. It verifies the shape
 * and the tier/custody invariants; it does NOT verify that the `npub` is a real key, that a
 * NIP-05 resolves, or that funds exist. Those are runtime concerns for the reference
 * implementations under the standard.
 *
 * Rules enforced:
 * - `npub` is a non-empty string (SPEC §1).
 * - `tier` is one of {@link TIERS} and `custody` is one of {@link CUSTODIES} (SPEC §2).
 * - `profile.handle` is a non-empty string (SPEC §3).
 * - `owned` ⇒ `custody === 'self'`; `computed` ⇒ `custody === 'platform'` (SPEC §2).
 * - `owned` ⇒ a NIP-05 is bound; `computed` ⇒ no NIP-05 (SPEC §3).
 * - `vhaiku`, if present, has a non-empty `tokenId` and a non-empty `renders` array (SPEC §4).
 *
 * Note on SPEC §5: a computed identity's structural inertness (it can never pass
 * {@link canActOutward}) is *guaranteed by construction* — the `platform`-custody rule below,
 * combined with `canActOutward` requiring `owned` + `self`, means no conformant computed identity
 * can act outward. There is therefore no separate reachable check for it here.
 *
 * @param id - the identity to check
 * @returns `{ ok, issues }`
 */
export declare function isConformant(id: AgenticIdentity): ConformanceResult;
/** One element of the six-element standard, as data. */
export interface StandardElement {
    /** The element number (1–6), matching the SPEC section. */
    n: number;
    /** Short title. */
    title: string;
    /** One-line summary. */
    summary: string;
}
/**
 * Return the six elements of the standard (SPEC §1–§6) as data.
 *
 * Trivial, but handy for surfacing the model in a UI or a conformance report.
 */
export declare function describeStandard(): StandardElement[];
