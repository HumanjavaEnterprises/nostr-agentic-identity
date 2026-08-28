# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- **`canActOutward(id)`** (SPEC §5): the load-bearing gate predicate. Strict `===`; returns `true`
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
