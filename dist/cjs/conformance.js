"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConformant = isConformant;
exports.describeStandard = describeStandard;
const types_js_1 = require("./types.js");
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
function isConformant(id) {
    const issues = [];
    // §1 — identity root
    if (typeof id.npub !== 'string' || id.npub.length === 0) {
        issues.push('npub must be a non-empty string (SPEC §1)');
    }
    // §2 — tiers and custody must be present and valid
    const tierValid = types_js_1.TIERS.includes(id.tier);
    const custodyValid = types_js_1.CUSTODIES.includes(id.custody);
    if (!tierValid) {
        issues.push(`tier must be one of ${types_js_1.TIERS.join(' | ')} (SPEC §2)`);
    }
    if (!custodyValid) {
        issues.push(`custody must be one of ${types_js_1.CUSTODIES.join(' | ')} (SPEC §2)`);
    }
    // §3 — profile is DATA
    if (!id.profile || typeof id.profile.handle !== 'string' || id.profile.handle.length === 0) {
        issues.push('profile.handle must be a non-empty string (SPEC §3)');
    }
    const hasNip05 = typeof id.profile?.nip05 === 'string' && id.profile.nip05.length > 0;
    // §2/§3 — tier-specific invariants (only meaningful when the tier is valid)
    if (tierValid) {
        if (id.tier === 'owned') {
            if (id.custody !== 'self') {
                issues.push('owned identity must be self-custodied (custody === "self") (SPEC §2)');
            }
            if (!hasNip05) {
                issues.push('owned identity must bind a NIP-05 (profile.nip05) (SPEC §3)');
            }
        }
        else if (id.tier === 'computed') {
            if (id.custody !== 'platform') {
                issues.push('computed identity must be platform-custodied (custody === "platform") (SPEC §2)');
            }
            if (hasNip05) {
                issues.push('computed identity must not bind a NIP-05 (SPEC §3)');
            }
        }
    }
    // §4 — vhaiku shape, if present
    if (id.vhaiku !== undefined) {
        if (typeof id.vhaiku.tokenId !== 'string' || id.vhaiku.tokenId.length === 0) {
            issues.push('vhaiku.tokenId must be a non-empty string (SPEC §4)');
        }
        if (!Array.isArray(id.vhaiku.renders) || id.vhaiku.renders.length === 0) {
            issues.push('vhaiku.renders must be a non-empty array (SPEC §4)');
        }
    }
    return { ok: issues.length === 0, issues };
}
/**
 * Return the six elements of the standard (SPEC §1–§6) as data.
 *
 * Trivial, but handy for surfacing the model in a UI or a conformance report.
 */
function describeStandard() {
    return [
        { n: 1, title: 'Identity root', summary: 'a self-custodied npub; the holder controls the nsec' },
        { n: 2, title: 'Two tiers', summary: 'computed (free/inert) and owned (paid/can-act)' },
        { n: 3, title: 'Profile', summary: 'kind-0 metadata; owned identities bind a NIP-05 on a paid anchor' },
        { n: 4, title: 'Vhaiku', summary: 'a visualization derived from the npub by code, not a hosted image' },
        { n: 5, title: 'Act-outward gate', summary: 'owned && self && verified && funded — the upsell is the abuse filter' },
        { n: 6, title: 'Passwordless auth', summary: 'magic link / QR / passkey, enumeration-safe, per-request reload' },
    ];
}
