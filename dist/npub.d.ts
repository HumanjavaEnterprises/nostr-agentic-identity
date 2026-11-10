/**
 * Dependency-free npub check (NIP-19 / BIP-173 bech32).
 *
 * Structural only: it proves the string is a well-formed bech32 `npub` carrying exactly 32
 * bytes. It does NOT prove the bytes are a point on secp256k1 or that anyone holds the nsec.
 *
 * @internal
 */
/**
 * `true` only for a lowercase bech32 (not bech32m) string with the `npub` prefix, a valid checksum and a
 * 32-byte payload. Never throws; any non-string returns `false`.
 */
export declare function isValidNpub(value: unknown): boolean;
