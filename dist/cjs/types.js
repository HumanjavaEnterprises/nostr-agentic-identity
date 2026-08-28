"use strict";
/**
 * Core types for the agentic identity standard.
 *
 * These are the typed expression of SPEC §1–§4. See {@link https://github.com/humanjavaenterprises/nostr-agentic-identity/blob/main/SPEC.md | SPEC.md}
 * for the authoritative definition.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CUSTODIES = exports.TIERS = void 0;
/**
 * The two tiers an identity may hold (SPEC §2).
 *
 * - `computed` — platform-derived, structurally inert (can never act outward).
 * - `owned` — freshly minted, self-custodied (can act outward when funded + verified).
 */
exports.TIERS = ['computed', 'owned'];
/**
 * Who custodies the identity's `nsec` (SPEC §2).
 *
 * - `platform` — the holder never receives an nsec (computed identities).
 * - `self` — the nsec was handed to the holder once and never retained (owned identities).
 */
exports.CUSTODIES = ['platform', 'self'];
