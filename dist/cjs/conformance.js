"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConformant = isConformant;
exports.describeStandard = describeStandard;
const types_js_1 = require("./types.js");
const npub_js_1 = require("./npub.js");
const own_js_1 = require("./own.js");
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
function isConformant(id, options) {
    try {
        return check(id, options);
    }
    catch {
        // A hostile or exotic object (throwing getter, revoked Proxy, ...) fails closed.
        return { ok: false, issues: ['identity could not be read (SPEC §1)'] };
    }
}
function isObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function nonEmptyString(v) {
    return typeof v === 'string' && v.length > 0;
}
function check(input, options) {
    if (!isObject(input)) {
        return { ok: false, issues: ['identity must be an object (SPEC §1)'] };
    }
    // Only OWN properties are read, on the identity and on the options (SPEC §5: data records).
    const npub = (0, own_js_1.own)(input, 'npub');
    const tier = (0, own_js_1.own)(input, 'tier');
    const custody = (0, own_js_1.own)(input, 'custody');
    const rawProfile = (0, own_js_1.own)(input, 'profile');
    const rawVhaiku = (0, own_js_1.own)(input, 'vhaiku');
    const looseNpub = isObject(options) && (0, own_js_1.own)(options, 'looseNpub') === true;
    const issues = [];
    // §1 — identity root
    if (looseNpub) {
        if (!nonEmptyString(npub)) {
            issues.push('npub must be a non-empty string (SPEC §1)');
        }
    }
    else if (!(0, npub_js_1.isValidNpub)(npub)) {
        issues.push(nonEmptyString(npub)
            ? 'npub must be a bech32 npub encoding a 32-byte public key (SPEC §1)'
            : 'npub must be a non-empty string; a bech32 npub encoding a 32-byte public key (SPEC §1)');
    }
    // §2 — tiers and custody must be present and valid
    const tierValid = types_js_1.TIERS.includes(tier);
    const custodyValid = types_js_1.CUSTODIES.includes(custody);
    if (!tierValid) {
        issues.push(`tier must be one of ${types_js_1.TIERS.join(' | ')} (SPEC §2)`);
    }
    if (!custodyValid) {
        issues.push(`custody must be one of ${types_js_1.CUSTODIES.join(' | ')} (SPEC §2)`);
    }
    // §3 — profile is DATA
    const profile = isObject(rawProfile) ? rawProfile : undefined;
    if (!profile || !nonEmptyString((0, own_js_1.own)(profile, 'handle'))) {
        issues.push('profile.handle must be a non-empty string (SPEC §3)');
    }
    const hasNip05 = profile !== undefined && nonEmptyString((0, own_js_1.own)(profile, 'nip05'));
    // §2/§3 — tier-specific invariants (only meaningful when the tier is valid)
    if (tierValid) {
        if (tier === 'owned') {
            if (custody !== 'self') {
                issues.push('owned identity must be self-custodied (custody === "self") (SPEC §2)');
            }
            if (!hasNip05) {
                issues.push('owned identity must bind a NIP-05 (profile.nip05) (SPEC §3)');
            }
        }
        else if (tier === 'computed') {
            if (custody !== 'platform') {
                issues.push('computed identity must be platform-custodied (custody === "platform") (SPEC §2)');
            }
            if (hasNip05) {
                issues.push('computed identity must not bind a NIP-05 (SPEC §3)');
            }
        }
    }
    // §4 — vhaiku shape, if present
    if (rawVhaiku !== undefined) {
        const vhaiku = isObject(rawVhaiku) ? rawVhaiku : undefined;
        const renders = vhaiku ? (0, own_js_1.own)(vhaiku, 'renders') : undefined;
        if (!vhaiku || !nonEmptyString((0, own_js_1.own)(vhaiku, 'tokenId'))) {
            issues.push('vhaiku.tokenId must be a non-empty string (SPEC §4)');
        }
        if (!Array.isArray(renders) || renders.length === 0) {
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
        { n: 2, title: 'Two tiers', summary: 'computed (platform-custody, inert) and owned (self-custody, can act)' },
        { n: 3, title: 'Profile', summary: 'kind-0 metadata; owned identities bind a NIP-05 on a controlled domain' },
        { n: 4, title: 'Vhaiku', summary: 'a visualization derived from the npub by code, not a hosted image' },
        { n: 5, title: 'Act-outward gate', summary: 'owned && self && verified && funded — an authorization and abuse-control boundary' },
        { n: 6, title: 'Passwordless auth', summary: 'magic link / QR / passkey, enumeration-safe, per-request reload' },
    ];
}
