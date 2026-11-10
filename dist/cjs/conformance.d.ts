import { type AgenticIdentity } from './types.js';
/** The result of a structural conformance check. */
export interface ConformanceResult {
    /** `true` when there are no structural issues. */
    ok: boolean;
    /** Human-readable descriptions of every structural rule the identity violates. */
    issues: string[];
}
/** Options for {@link isConformant}. */
export interface ConformanceOptions {
    /**
     * Opt back into the 0.1.x rule for SPEC §1: accept any non-empty `npub` string without
     * checking that it is a bech32 npub. Default `false` (the npub is validated).
     */
    looseNpub?: boolean;
}
/**
 * Check an identity against the structural rules of the standard (SPEC §1–§5).
 *
 * This is a **pure, structural** check — no I/O, no network. It verifies the shape and the
 * tier/custody invariants; it does NOT verify that the `npub` is a point on the curve, that a
 * NIP-05 resolves, or that funds exist. Those are runtime concerns for the reference
 * implementations under the standard.
 *
 * Rules enforced:
 * - `npub` is a lowercase bech32 `npub` with a valid checksum and a 32-byte payload (SPEC §1).
 *   Pass `{ looseNpub: true }` to fall back to the 0.1.x non-empty-string rule.
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
 * Only **own** properties of `id`, its `profile`/`vhaiku`, and `options` are read; inherited
 * values (a prototype, a polluted `Object.prototype`) count as missing.
 *
 * Never throws: `null`, non-objects, and objects with throwing getters return `ok: false` with
 * at least one issue.
 *
 * @param id - the identity to check
 * @param options - see {@link ConformanceOptions}
 * @returns `{ ok, issues }`
 */
export declare function isConformant(id: AgenticIdentity, options?: ConformanceOptions): ConformanceResult;
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
