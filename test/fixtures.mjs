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
      npub: 'npub1z5q4k0mj8jvelrfdpcl298vry6c9tq6tggnv0mz7ufmeg8c5d38swpv7wd',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'guest-4f2a' },
    },
    expect: { conformant: true, canAct: false, issue: null },
  },
  {
    name: 'ownedValid',
    id: {
      npub: 'npub1j2ge0nnaqapsyjcsjctz7qxudvcnmststjrl3tnvv83ntaw2xfgqqduuta',
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
      npub: 'npub1fxutsuw9ggf59jq8te8pv5y6t3m0xuuaf9znt4tmhddh8xw0d40qcwxpx2',
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
      npub: 'npub1xuddc4pt0ylfg3vj85jjsej8xsuvp4f4quh6svkqj84eq4fxkk6qrewjuh',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'guest', nip05: 'guest@paid.example' },
    },
    expect: { conformant: false, canAct: false, issue: 'must not bind a NIP-05' },
  },
  {
    name: 'ownedNotSelfCustody',
    id: {
      npub: 'npub1k28m9mwcazq3lz6ztwsd6jwv76wqllatzhc89yavvg2zf6zhdudsgdjacp',
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
      npub: 'npub1v2r7uw6pvcusz0dg9pdy95z5zxy68fgpyuqqqljujp4s7gajnt6sqljg5z',
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
      npub: 'npub1ae6gzwnzck0239gfs6xwve833kfk92yj39uv8prttuq7j2kadv7sw6gh8r',
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
      npub: 'npub12eylnvultlqcsaj5t5n7hrafmdu2rfdmvwddczcue7j5qf6kz5tq4054ew',
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
      npub: 'npub1dar7v3ut9fsv0c4e672py0x0fquzvghng883dyzs8zdh5klpur6quavm7c',
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
      npub: 'npub13wkpeg5wkpv80pk8ys4a3npmk80m9lj7r5rsd3sxfpl80s0tchzs5um6a7',
      tier: 'owned',
      custody: 'self',
      profile: { handle: 'ada', nip05: 'ada@paid.example' },
      verified: true,
      funded: true,
      vhaiku: { tokenId: 'tok1', renders: [] },
    },
    expect: { conformant: false, canAct: true, issue: 'vhaiku.renders must be a non-empty array' },
  },
  {
    // SPEC §1: the root is a bech32 npub. A non-bech32 string must not pass.
    name: 'notAnNpub',
    id: { npub: 'not-an-npub', tier: 'computed', custody: 'platform', profile: { handle: 'x' } },
    expect: { conformant: false, canAct: false, issue: 'npub must be a bech32 npub' },
  },
  {
    // Valid-looking npub with one checksum character changed.
    name: 'npubBadChecksum',
    id: {
      npub: 'npub1z5q4k0mj8jvelrfdpcl298vry6c9tq6tggnv0mz7ufmeg8c5d38swpv7wq',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'x' },
    },
    expect: { conformant: false, canAct: false, issue: 'npub must be a bech32 npub' },
  },
  {
    // Correct bech32 checksum but the nsec prefix: never accept a secret key as the root.
    name: 'nsecAsNpub',
    id: {
      npub: 'nsec194c3vs4hy6cygqtz0j5lhtpj7hy9xra3jq7vfkczykr30ys6fzqs7qqm39',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'x' },
    },
    expect: { conformant: false, canAct: false, issue: 'npub must be a bech32 npub' },
  },
  {
    // Correct checksum and prefix, but a 31-byte payload.
    name: 'npubShortPayload',
    id: {
      npub: 'npub194c3vs4hy6cygqtz0j5lhtpj7hy9xra3jq7vfkczykr30ys6fqjnq85f',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'x' },
    },
    expect: { conformant: false, canAct: false, issue: 'npub must be a bech32 npub' },
  },
];

/** Every fixture, valid + invalid, in one list. */
export const allFixtures = [...validFixtures, ...invalidFixtures];
