/**
 * Core types for the agentic identity standard.
 *
 * These are the typed expression of SPEC §1–§4. See {@link https://github.com/humanjavaenterprises/nostr-agentic-identity/blob/main/SPEC.md | SPEC.md}
 * for the authoritative definition.
 *
 * @packageDocumentation
 */

/**
 * The two tiers an identity may hold (SPEC §2).
 *
 * - `computed` — free, platform-derived, structurally inert (can never act outward).
 * - `owned` — paid, freshly minted, self-custodied (can act outward when funded + verified).
 */
export const TIERS = ['computed', 'owned'] as const;

/** An identity tier — `'computed'` or `'owned'` (SPEC §2). */
export type Tier = (typeof TIERS)[number];

/**
 * Who custodies the identity's `nsec` (SPEC §2).
 *
 * - `platform` — the holder never receives an nsec (computed identities).
 * - `self` — the nsec was handed to the holder once and never retained (owned identities).
 */
export const CUSTODIES = ['platform', 'self'] as const;

/** A custody mode — `'platform'` or `'self'` (SPEC §2). */
export type Custody = (typeof CUSTODIES)[number];

/**
 * The identity's profile — its DATA, distinct from its visualization (SPEC §3).
 *
 * Published as a Nostr kind-0 event signed by the identity's key. Owned identities
 * carry a NIP-05 binding on a paid anchor; computed identities carry only a free,
 * provider-scoped handle.
 */
export interface Profile {
  /** The display handle. Free/provider-scoped for computed; paid for owned. */
  handle: string;
  /** NIP-05 binding on a paid anchor. Present for `owned`, absent for `computed`. */
  nip05?: string;
}

/**
 * A vhaiku — a visualization derived from the npub by code, NOT a hosted image (SPEC §4).
 *
 * This package does not generate vhaikus; it only carries the reference. Generation is a
 * reference implementation (`vhaiku`) that lives under the standard.
 */
export interface Vhaiku {
  /** Deterministic token identifying this render set (derived from the key). */
  tokenId: string;
  /** Render variants (e.g. avatar, banner, mark), each code-derived — never hosted media. */
  renders: string[];
}

/**
 * An agentic identity (SPEC §1–§4).
 *
 * The capability-bearing fields (`tier`, `custody`, `verified`, `funded`) gate outward
 * action via {@link canActOutward}. They MUST be non-forgeable at the trust boundary where
 * the gate is enforced — re-load the identity from your store of record, never trust a
 * caller-supplied or deserialized object (SPEC §5).
 */
export interface AgenticIdentity {
  /** The self-custodied Nostr public key, bech32-encoded (SPEC §1). The stable anchor. */
  npub: string;
  /** The tier — `computed` (free/inert) or `owned` (paid/can-act) (SPEC §2). */
  tier: Tier;
  /** Who holds the nsec — `platform` or `self` (SPEC §2). */
  custody: Custody;
  /** The identity's profile data (SPEC §3). */
  profile: Profile;
  /** Optional code-derived visualization reference (SPEC §4). */
  vhaiku?: Vhaiku;
  /** Whether the identity has been verified. A capability-bearing field (SPEC §5). */
  verified?: boolean;
  /** Whether the identity is funded. A capability-bearing field (SPEC §5). */
  funded?: boolean;
}
