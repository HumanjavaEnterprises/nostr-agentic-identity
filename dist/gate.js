import { own } from './own.js';
/**
 * The act-outward gate (SPEC §5) — the single rule this standard enforces.
 *
 * An identity may perform an **outward** action (send email, place a call, publish on its
 * behalf) **only when** it is `owned` + `self`-custody + `verified` + `funded`. A `computed`
 * identity is structurally unable to pass — it is never `owned`, never `self`-custody — so an
 * identity no one has vouched for can be *seen and reached* but never *acts*.
 *
 * This predicate is an authorization and abuse-control boundary: `verified` and `funded` are
 * what make outward action attributable and costly. The standard does not prescribe how an
 * implementation establishes either signal.
 *
 * The comparison is strict (`===`): a truthy-but-non-`true` value (`1`, `'yes'`) does NOT pass.
 * The capability-bearing fields MUST be non-forgeable at the trust boundary — call this on an
 * identity re-loaded from your store of record, never on a caller-supplied or deserialized
 * object.
 *
 * Only **own** properties are read: a field inherited from a prototype (including a class
 * instance's prototype getter, or a polluted `Object.prototype`) does not count.
 *
 * Never throws: `null`, `undefined`, arrays, non-objects, and objects whose fields cannot be read
 * return `false`.
 *
 * @param id - the identity to evaluate
 * @returns `true` only for `owned` + `self` + `verified === true` + `funded === true`
 */
export function canActOutward(id) {
    // Fail closed: anything that is not a readable object is denied, never a TypeError.
    // Arrays are not identity records. Only OWN properties count: inherited values (a prototype,
    // a polluted Object.prototype) never grant capability.
    if (typeof id !== 'object' || id === null || Array.isArray(id))
        return false;
    try {
        return (own(id, 'tier') === 'owned' &&
            own(id, 'custody') === 'self' &&
            own(id, 'verified') === true &&
            own(id, 'funded') === true);
    }
    catch {
        return false;
    }
}
