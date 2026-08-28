/**
 * Synthetic agentic-identity fixtures — the ONE source of truth for both the
 * vitest unit tests (`test/*.test.ts`) and the built-artifact smoke test
 * (`scripts/smoke.mjs`).
 *
 * ── Why plain `.mjs` and not `fixtures.ts`? ──────────────────────────────────
 * The smoke test must import the BUILT `dist` and run node directly (no dev
 * transpile). If these fixtures were `.ts`, `scripts/smoke.mjs` could only load
 * them after a TypeScript compile step — a dev-only surprise that breaks
 * `npm run smoke` from a clean checkout. Authoring them as pure-data ESM JS lets
 * BOTH consumers import the exact same objects with zero transpile: vitest loads
 * them through esbuild, node loads them natively. The malformed fixtures are
 * intentionally off-spec, so leaving them untyped is also honest — a `.ts`
 * annotation would have to be defeated with casts anyway.
 *
 * Each fixture carries its EXPECTED verdict so tests and smoke are data-driven
 * off this single table:
 *   - `expect.conformant`   — expected `isConformant(id).ok`
 *   - `expect.canAct`       — expected `canActOutward(id)`
 *   - `expect.issue`        — substring expected in `isConformant(id).issues`
 *                             (omitted / null for the conformant fixtures)
 *
 * These fixtures do NOT live in the published package: `test/` is excluded by
 * `.npmignore`, and the build's tsconfig only includes `src/`, so nothing here
 * ever reaches `dist/`.
 */

/** Fixtures that MUST pass `isConformant`. */
export const validFixtures = [
  {
    name: 'computedValid',
    id: {
      npub: 'npub1computedvalid',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'guest-4f2a' },
    },
    expect: { conformant: true, canAct: false, issue: null },
  },
  {
    name: 'ownedValid',
    id: {
      npub: 'npub1ownedvalid',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
      vhaiku: { tokenId: 'tok-ada-01', renders: ['avatar', 'banner', 'mark'] },
    },
    expect: { conformant: true, canAct: true, issue: null },
  },
];

/** Fixtures that MUST be rejected by `isConformant` (each with the issue it must emit). */
export const invalidFixtures = [
  {
    name: 'ownedNoNip05',
    id: {
      npub: 'npub1ownednonip05',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada' },
      verified: true,
      funded: true,
    },
    // Gate still passes (owned+self+verified+funded) — conformance is a separate axis.
    expect: { conformant: false, canAct: true, issue: 'must bind a NIP-05' },
  },
  {
    name: 'computedWithNip05',
    id: {
      npub: 'npub1computedwithnip05',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'guest', nip05: 'guest@paid.example' },
    },
    expect: { conformant: false, canAct: false, issue: 'must not bind a NIP-05' },
  },
  {
    name: 'ownedNotSelfCustody',
    id: {
      npub: 'npub1ownednotself',
      tier: 'owned',
      custody: 'platform',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
    },
    expect: { conformant: false, canAct: false, issue: 'must be self-custodied' },
  },
  {
    // The forged-custody case: computed dressed up to look like it can act.
    name: 'computedForgedActor',
    id: {
      npub: 'npub1forged',
      tier: 'computed',
      custody: 'self',
      profile: { handle: 'guest' },
      verified: true,
      funded: true,
    },
    expect: { conformant: false, canAct: false, issue: 'must be platform-custodied' },
  },
  {
    name: 'invalidTier',
    id: {
      npub: 'npub1invalidtier',
      tier: 'premium',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
    },
    expect: { conformant: false, canAct: false, issue: 'tier must be one of' },
  },
  {
    name: 'emptyNpub',
    id: {
      npub: '',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
    },
    expect: { conformant: false, canAct: true, issue: 'npub must be a non-empty string' },
  },
  {
    name: 'emptyHandle',
    id: {
      npub: 'npub1emptyhandle',
      tier: 'owned',
      custody: 'self',
      profile: { handle: '', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
    },
    expect: { conformant: false, canAct: true, issue: 'profile.handle must be a non-empty string' },
  },
  {
    // The untested branch the checker flagged: vhaiku present but tokenId empty.
    name: 'vhaikuEmptyTokenId',
    id: {
      npub: 'npub1vhaikunotoken',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
      vhaiku: { tokenId: '', renders: ['avatar'] },
    },
    expect: { conformant: false, canAct: true, issue: 'vhaiku.tokenId must be a non-empty string' },
  },
  {
    name: 'vhaikuEmptyRenders',
    id: {
      npub: 'npub1vhaikunorenders',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
      vhaiku: { tokenId: 'tok1', renders: [] },
    },
    expect: { conformant: false, canAct: true, issue: 'vhaiku.renders must be a non-empty array' },
  },
];

/** Every fixture, valid + invalid, in one list. */
export const allFixtures = [...validFixtures, ...invalidFixtures];
