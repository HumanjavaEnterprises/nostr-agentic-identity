/**
 * Read a property only if it is an OWN property of `obj`; inherited values (prototype chain,
 * a polluted `Object.prototype`) read as `undefined`. Identities are data records (SPEC §5).
 *
 * @internal
 */
export function own(obj: object, key: string): unknown {
  return Object.prototype.hasOwnProperty.call(obj, key)
    ? (obj as Record<string, unknown>)[key]
    : undefined;
}
