**nostr-agentic-identity v0.1.0**

***

# nostr-agentic-identity

<div align="center">

[![npm version](https://img.shields.io/npm/v/nostr-agentic-identity.svg)](https://www.npmjs.com/package/nostr-agentic-identity)
[![npm downloads](https://img.shields.io/npm/dm/nostr-agentic-identity.svg)](https://www.npmjs.com/package/nostr-agentic-identity)
[![License](https://img.shields.io/npm/l/nostr-agentic-identity.svg)](https://github.com/humanjavaenterprises/nostr-agentic-identity/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Test Status](https://img.shields.io/github/actions/workflow/status/humanjavaenterprises/nostr-agentic-identity/ci.yml?branch=main&label=tests)](https://github.com/humanjavaenterprises/nostr-agentic-identity/actions)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

</div>

**A standard for agentic identity on Nostr — plus the thin conformance primitive that checks it.**

This package is deliberately light: it is *not* a framework, a key mint, a relay client, or a login
system. It ships the **definition** of what an agentic identity is — see **[SPEC.md](_media/SPEC.md)**, the
authoritative standard — and the smallest possible code surface that enforces the load-bearing rule: the
types, the act-outward **gate predicate**, and a pure structural **conformance checker**. The heavy
reference implementations (vhaiku rendering, the identity composer, auth) live *under* the standard and are
referenced, not bundled.

> Status: **DRAFT 0.1** · The standard says **what**; the builder keeps discretion over **how** (which
> relay, storage, login, wallet). Read **[SPEC.md](_media/SPEC.md)** first — the code here is a thin expression of it.

## Core Features

- 🪪 **The agentic identity model, as types** — `AgenticIdentity`, `Tier` (`computed` | `owned`),
  `Custody` (`platform` | `self`), and the `TIERS` / `CUSTODIES` constants. The six-element model of the
  standard, typed.
- 🚪 **The act-outward gate** — `canActOutward(id)`: the one load-bearing predicate. Strict `===`; an
  identity may act outward **only** when it is `owned` + `self`-custody + `verified` + `funded`. Byte-for-byte
  the rule in [SPEC §5](_media/SPEC.md#5-the-act-outward-gate).
- ✅ **A structural conformance checker** — `isConformant(id)` returns `{ ok, issues[] }` against the
  spec's structural rules (tier/custody valid; owned ⇒ NIP-05; computed ⇒ no NIP-05, platform custody;
  owned ⇒ self-custody; etc.). Pure, no I/O.
- 🪶 **Zero runtime dependencies** — types + one predicate + a checker. The lightest peer in the `nostr-*`
  family. ESM + CommonJS + `.d.ts`, plus a browser bundle.

## The Standard (six elements)

The full standard is **[SPEC.md](_media/SPEC.md)**. In brief, a conforming agentic identity solves for:

1. **Identity root** — a self-custodied `npub`; the holder controls the `nsec`.
2. **Two tiers** — `computed` (platform-custody, inert) and `owned` (self-custody, can act). The
   distinction is custody, not price; the standard is silent on pricing.
3. **Profile** — kind-0 metadata; owned identities bind a **NIP-05** on a controlled domain.
4. **Vhaiku** — a visualization *derived from the npub by code*, **not a hosted image**.
5. **The act-outward gate** — `owned && self && verified && funded` (§5); an authorization and
   abuse-control boundary.
6. **Passwordless auth** — magic link / QR / passkey, enumeration-safe, per-request reload.

`describeStandard()` returns this list as data.

## NIPs Support

🟢 Referenced by the standard 🟡 Composed by reference impls

| NIP | Status | Role in the standard |
|-----|--------|----------------------|
| 01 | 🟢 | kind-0 profile events (§3) |
| 05 | 🟢 | paid-anchor handle binding for owned identities (§3) |
| 06 | 🟡 | seed-phrase key derivation (owned mint, via `nostr-nsec-seedphrase`) |
| 19 | 🟢 | `npub` / `nsec` bech32 encoding (§1) |
| 47 | 🟡 | wallet connect for the `funded` signal (§5, reference impls) |

## Installation

```bash
npm install nostr-agentic-identity
```

## Quick Start

### Gate an outward action

```typescript
import { canActOutward, type AgenticIdentity } from 'nostr-agentic-identity';

const owned: AgenticIdentity = {
  npub: 'npub1...',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada', nip05: 'ada@paid.example' },
  verified: true,
  funded: true,
};

if (canActOutward(owned)) {
  // send the email / place the call / publish on its behalf
}

const computed: AgenticIdentity = {
  npub: 'npub1...',
  tier: 'computed',
  custody: 'platform',
  profile: { handle: 'guest-4f2a' },
};

canActOutward(computed); // false — a computed identity is structurally inert
```

> **Gate at the trust boundary.** Call `canActOutward` on an identity you re-loaded from your own store of
> record — never on a caller-supplied or freshly-deserialized object. The capability-bearing fields
> (`tier`, `custody`, `verified`, `funded`) MUST be non-forgeable where you enforce the gate (SPEC §5).

### Check conformance

```typescript
import { isConformant, type AgenticIdentity } from 'nostr-agentic-identity';

const result = isConformant({
  npub: 'npub1...',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada' }, // missing NIP-05 for an owned identity
});

result.ok;      // false
result.issues;  // ['owned identity must bind a NIP-05 (profile.nip05) (SPEC §3)']
```

### Describe the standard

```typescript
import { describeStandard } from 'nostr-agentic-identity';

for (const element of describeStandard()) {
  console.log(`${element.n}. ${element.title} — ${element.summary}`);
}
```

## Documentation

- **[SPEC.md](_media/SPEC.md)** — the authoritative standard (the six elements, conformance rules, what it is NOT).
- API docs are generated from source with TypeDoc:

  ```bash
  npm run docs
  ```

## Module Support

Dual ESM + CommonJS, with a browser bundle and full type declarations.

### ESM (recommended)
```typescript
import { canActOutward } from 'nostr-agentic-identity';
```

### CommonJS
```javascript
const { canActOutward } = require('nostr-agentic-identity');
```

## Reference implementations (under the standard, not bundled here)

- **`vhaiku`** — the code-derived visualization generator (§4).
- **the identity composer** — pure composition of §1–§5 with all I/O injected.
- **Primitives** — `nostr-nsec-seedphrase` (keys), `nostr-crypto-utils` (crypto), the `nostr-*` auth family.

## Contributing

We welcome contributions! Please see our [Contributing Guide](_media/CONTRIBUTING.md) for details.

## Security

See [SECURITY.md](_media/SECURITY.md) for how to report a vulnerability. Note the trust-boundary guidance above:
this package is a checker — enforcement is only as strong as the non-forgeability of the fields you feed it.

## License

MIT License — see the [LICENSE](_media/LICENSE) file for details.

## Changelog

See [CHANGELOG.md](_media/CHANGELOG.md) for a detailed history of changes.
