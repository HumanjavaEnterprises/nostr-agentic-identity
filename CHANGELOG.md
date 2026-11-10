# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-11-10

Fixes from the 2026-11-10 package review. Minor bump because of the Breaking item below.

### Breaking
- **`isConformant` now validates the `npub` (SPEC §1).** It must be a lowercase bech32 `npub` with a
  valid checksum and a 32-byte payload. Placeholders (`'npub1...'`), hex keys, `nsec` strings and
  upper-case npubs are now reported as issues. Opt back into the 0.1.x rule (any non-empty string)
  with `isConformant(id, { looseNpub: true })` (strictly `true`; `1` or `'true'` do not count).
  Dependency-free; the package still has zero runtime deps.
- **Only own properties are read** by `canActOutward` and `isConformant` (identity, `profile`,
  `vhaiku`, and `options`). Fields inherited through a prototype no longer count, so class instances
  that expose `tier` / `custody` / `verified` / `funded` (or `npub`, `profile`, ...) as prototype getters
  are no longer accepted. Pass a plain data record. This closes a hole where
  `canActOutward(Object.create({ tier: 'owned', ... }))`, or `canActOutward({})` under a polluted
  `Object.prototype`, returned `true`, and where a polluted `Object.prototype.looseNpub` turned the npub
  rule off. SPEC §5 now says "own properties".
- **Arrays are denied by `canActOutward`**, even when they carry the capability fields.
- **`TIERS` and `CUSTODIES` are frozen** (`Object.freeze`); mutating them throws and cannot widen
  what `isConformant` accepts.

### Fixed
- **Browser bundlers got `undefined` for every import.** The `browser` condition (and top-level
  `browser` field) pointed at an IIFE script with no exports. Both now point at the ESM `dist/index.js`.
  The IIFE stays available for `<script>` tags via the `unpkg` / `jsdelivr` fields.
- **Cloudflare Workers** resolve the ESM build through new `workerd` / `worker` conditions.
- **`canActOutward(null | undefined | garbage)` returns `false` instead of throwing a `TypeError`.**
  Objects whose fields cannot be read (throwing getters, Proxies) are also denied.
- **`isConformant` never throws.** `null`, non-objects, `profile: null`, `vhaiku: null` and
  unreadable objects return `{ ok: false, issues: [...] }`.

### Added
- `ConformanceOptions` type (`{ looseNpub?: boolean }`) as the optional second argument of `isConformant`.
- `exports["./package.json"]`, `exports["."].default`, `engines` (`node >= 20`), `sideEffects: false`.

### Changed
- Tarball: drops `examples/` and the browser source map; adds `CHANGELOG.md`. `build` now cleans `dist/` first.
- Dev tooling: `vitest` / `@vitest/coverage-v8` 4.1.12 and a `minimatch ^11.0.6` override, so `npm audit` is clean.

## [0.1.1] - 2026-08-28

Documentation correction. No API changes — every export, signature, and behavior is identical to
0.1.0; `canActOutward` and `isConformant` are byte-for-byte the same logic.

### Changed
- **SPEC.md §2** — the two tiers are now defined by **custody** (platform-derived vs self-custodied)
  rather than by price. The tier table's `Cost` row is replaced with `Accountability`.
- **SPEC.md §5** — retitled to "The act-outward gate" and described as an authorization and
  abuse-control boundary. `verified` and `funded` are what make outward action attributable and
  costly; the standard no longer characterizes the predicate in commercial terms.
- **SPEC.md §4** — describes the required *property* (any deterministic, code-derived generator
  conforms) instead of naming a specific unreleased generator as the reference implementation.
- **SPEC.md "What this standard is NOT"** — adds an explicit **Not a business model** boundary: the
  standard is silent on pricing, packaging, and tiering economics, and two conforming implementations
  may make opposite commercial choices.
- **`describeStandard()`** — element summaries for §2, §3 and §5 reworded to match the above. This is
  a *string content* change in returned data, not a shape change.
- Doc-comments in `types.ts` and `gate.ts`, and the corresponding README sections, reworded to match.

### Why
0.1.0 carried framing from internal product design into a public standard. Beyond being internal, it
made the specification less useful: a standard that hard-codes one party's tier economics cannot be
adopted by an implementer whose economics differ. Conformance turns on custody and accountability,
which is the actual technical invariant.

## [0.1.0] - 2026-08-28

Initial draft release — the standard, plus the thin conformance primitive.

### Added
- **[SPEC.md](SPEC.md)** — the authoritative agentic identity standard (DRAFT 0.1): the six
  elements a conforming identity solves for (self-custodied npub; computed/owned tiers; kind-0
  profile + NIP-05 for owned; vhaiku as code-derived visualization; the act-outward gate;
  passwordless + enumeration-safe + per-request-reload auth), the conformance rules, and what the
  standard is NOT. Preserves the full prose formerly in the README.
- **Types** (SPEC §1–§4): `AgenticIdentity`, `Tier` (`'computed' | 'owned'`),
  `Custody` (`'platform' | 'self'`), `Profile`, `Vhaiku`, and the `TIERS` / `CUSTODIES` constants.
- **`canActOutward(id)`** (SPEC §5): the gate predicate this standard turns on. Strict `===`; returns `true`
  only for `owned` + `self` + `verified === true` + `funded === true`.
- **`isConformant(id)`**: a pure structural conformance checker returning `{ ok, issues[] }`
  (tier/custody valid; owned ⇒ self-custody + NIP-05; computed ⇒ platform-custody + no NIP-05 +
  structurally inert; vhaiku shape; SPEC §1–§5). No I/O.
- **`describeStandard()`**: the six-element list, as data.
- Dual ESM + CommonJS build with `.d.ts` and a browser IIFE bundle. **Zero runtime dependencies.**
- House-standard repo scaffolding matching the `nostr-*` family: README (badges + structured
  sections linking to SPEC.md), SECURITY / CONTRIBUTING / CODE_OF_CONDUCT / TODO, CI + publish
  workflows, issue/PR templates, eslint + prettier + vitest + typedoc config.

### Notes
- This package is a **checker, not an enforcer**: it does not mint keys, talk to relays, render
  vhaikus, or log anyone in. Those are the heavy reference implementations (`vhaiku`, the identity
  composer, the `nostr-*` auth family) that live *under* the standard and are referenced, not bundled.
