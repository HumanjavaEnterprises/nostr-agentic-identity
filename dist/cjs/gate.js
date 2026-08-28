"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canActOutward = canActOutward;
/**
 * The act-outward gate (SPEC §5) — the one load-bearing predicate of the standard.
 *
 * An identity may perform an **outward** action (send email, place a call, publish on its
 * behalf) **only when** it is `owned` + `self`-custody + `verified` + `funded`. A `computed`
 * identity is structurally unable to pass — it is never `owned`, never `self`-custody — so the
 * free tier can be *seen and reached* but never *acts*.
 *
 * This single predicate is simultaneously the commercial gate (own it to act) and the abuse
 * filter (an unfunded, unverified stranger cannot send or call).
 *
 * The comparison is strict (`===`): a truthy-but-non-`true` value (`1`, `'yes'`) does NOT pass.
 * The capability-bearing fields MUST be non-forgeable at the trust boundary — call this on an
 * identity re-loaded from your store of record, never on a caller-supplied or deserialized
 * object.
 *
 * @param id - the identity to evaluate
 * @returns `true` only for `owned` + `self` + `verified === true` + `funded === true`
 */
function canActOutward(id) {
    return (id.tier === 'owned' &&
        id.custody === 'self' &&
        id.verified === true &&
        id.funded === true);
}
