"use strict";
/**
 * Dependency-free npub check (NIP-19 / BIP-173 bech32).
 *
 * Structural only: it proves the string is a well-formed bech32 `npub` carrying exactly 32
 * bytes. It does NOT prove the bytes are a point on secp256k1 or that anyone holds the nsec.
 *
 * @internal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNpub = isValidNpub;
const CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
const GENERATOR = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function polymod(values) {
    let chk = 1;
    for (const v of values) {
        const top = chk >>> 25;
        chk = ((chk & 0x1ffffff) << 5) ^ v;
        for (let i = 0; i < 5; i++) {
            if ((top >>> i) & 1)
                chk ^= GENERATOR[i];
        }
    }
    return chk;
}
function hrpExpand(hrp) {
    const out = [];
    for (let i = 0; i < hrp.length; i++)
        out.push(hrp.charCodeAt(i) >>> 5);
    out.push(0);
    for (let i = 0; i < hrp.length; i++)
        out.push(hrp.charCodeAt(i) & 31);
    return out;
}
/**
 * `true` only for a lowercase bech32 (not bech32m) string with the `npub` prefix, a valid checksum and a
 * 32-byte payload. Never throws; any non-string returns `false`.
 */
function isValidNpub(value) {
    if (typeof value !== 'string')
        return false;
    // npub1 + 52 data chars + 6 checksum chars = 63. Only the canonical lowercase form is
    // accepted, so one key has exactly one npub string (the stable anchor, SPEC §1).
    if (value.length !== 63)
        return false;
    const s = value;
    if (!s.startsWith('npub1'))
        return false;
    const data = [];
    for (let i = 5; i < s.length; i++) {
        const d = CHARSET.indexOf(s[i]);
        if (d === -1)
            return false;
        data.push(d);
    }
    if (polymod([...hrpExpand('npub'), ...data]) !== 1)
        return false;
    // 5-bit -> 8-bit, strict padding (BIP-173 convertbits with pad=false).
    const words = data.slice(0, -6);
    let acc = 0;
    let bits = 0;
    let bytes = 0;
    for (const w of words) {
        acc = (acc << 5) | w;
        bits += 5;
        while (bits >= 8) {
            bits -= 8;
            bytes += 1;
            acc &= (1 << bits) - 1;
        }
    }
    if (bits >= 5 || acc !== 0)
        return false;
    return bytes === 32;
}
