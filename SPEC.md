# The Agentic Identity Standard

**A standard for agentic identity on Nostr.** Not a framework — a *definition*: what an agentic identity
is, and the elements a conforming implementation solves for. Light by design. The standard says **what**;
the builder keeps discretion over **how** (which relay, storage, login, wallet). Reference implementations
live *under* this standard, never baked into it.

> Status: **DRAFT 0.1** · License: MIT · Prior art it composes: `nostr-nsec-seedphrase`,
> `nostr-crypto-utils`, NIP-01/05/06/19/47.

## Why

Most Nostr identity tooling models a *human* with a keypair. An **agent** needs more, and needs it
*solved the same way every time*: a sovereign key it holds, a presence it owns, a way to be *seen and
reached* before it can *act*, and a visual identity that persists **as code, not as a hosted image**.
This standard names those elements so an agentic identity means the same thing across implementations —
and so a human is simply the well-behaved subset of the same model.

## The elements (a conforming agentic identity solves for all six)

### 1. Identity root — a self-custodied npub
The identity IS a Nostr keypair. The holder controls the `nsec`; the platform never custodies an
**owned** key. The `npub` is the stable anchor everything else keys to. *(Ref: `nostr-nsec-seedphrase`
`generateKeyPairWithSeed()` for an owned mint; NIP-19 for encoding.)*

### 2. Two tiers — computed (free) and owned (paid)
An identity is one of two tiers, and this distinction is load-bearing:

| | **computed** | **owned** |
|---|---|---|
| Key | derived deterministically from a platform seed | freshly minted, self-custodied |
| Custody | `platform` (the holder never receives an nsec) | `self` (nsec handed over **once**, never stored) |
| Handle | free, provider-scoped | a paid handle on a paid anchor (NIP-05) |
| **Can act outward** | **no** | **yes** (§5) |
| Cost | free — the on-ramp | paid — the commitment |

Every agent (and human) may hold a **computed** identity for free: reachable, displayable, real — but
*inert*. Owning it is a deliberate upgrade. **Upgrade = re-mint**: a fresh owned key is minted (the
computed key was platform-derived and never the holder's), and activity re-points from the old `npub` to
the new one via a `{from, to}` remap.

### 3. Profile — the identity's DATA
Handle + metadata, published as a Nostr **kind-0** event signed by the identity's key. Owned identities
carry a **NIP-05** binding on a paid anchor; computed identities carry only a free provider-scoped handle.
The profile is DATA — distinct from its visualization (§4).

### 4. Vhaiku — a visualization *derived from the npub by code*
A **vhaiku** is a visual rendering of a profile (avatar, banner, mark, isometric). The standard's
principle: **a vhaiku is computed deterministically from the identity's key — it is not a hosted image.**
It persists as long as the seed and a conforming generator exist: no CDN, no PNG to rot, no external
hosting. Any deterministic generator conforms (pure procedural, or DiceBear-style). *(Ref implementation:
the `vhaiku` package — procedural by default, DiceBear optional.)*

> This is a first-class value of the standard, not an implementation detail: **identity art is code, not
> media.** It's how an agent's face survives without a server hosting it.

### 5. The act-outward gate — the one line where the upsell IS the abuse filter
An identity may perform an **outward** action (send email, place a call, publish on its behalf) **only
when**:

```
canActOutward(id)  ==  id.tier === 'owned'
                    && id.custody === 'self'
                    && id.verified === true
                    && id.funded  === true
```

A **computed** identity is structurally unable to pass this — it is never `owned`, never `self`-custody.
So the free tier can be *seen and reached* but never *acts*. This single predicate is simultaneously the
commercial gate (own it to act) and the abuse filter (an unfunded, unverified stranger cannot send or
call). Conforming consumers gate every outward capability on exactly this — never on a caller-supplied or
deserialized identity object (the capability-bearing fields MUST be non-forgeable at the trust boundary).

### 6. Passwordless auth — the door
Access is **passwordless, always** — magic link, QR bearer, or passkey; never a stored password.
Auth/intake responses are **enumeration-safe** (identical for known/unknown). Sessions re-load the
identity **per request** so revocation is instant. *Which* methods a builder wires is their discretion;
that it is passwordless and enumeration-safe is the standard. *(Ref: `nostr-auth-middleware`,
`nostr-dm-magiclink-utils`, `nostr-biometric-auth-utils`.)*

## What this standard is NOT

- **Not a heavy dependency.** The elements are solved, but *how* you store, relay, sign, send, and pay is
  yours. A conforming implementation is a composition layer with I/O **injected**, not a monolith that
  pins your stack.
- **Not an identity mint.** The holder self-generates its key; a conforming platform serves only keys
  behind a funded, verified relationship. The paywall is the fraud filter — never an open self-serve mint.
- **Not custody.** An owned `nsec` is handed to the holder once and never retained.
- **Not human-vs-agent.** One model. A human is the subset that logs in with an email magic link instead
  of holding its own wallet; the six elements are identical.

## Conformance

An implementation conforms if: (1) identities are self-custodied Nostr keys; (2) both tiers exist with the
custody semantics of §2; (3) profiles publish as kind-0 and owned handles bind via NIP-05; (4)
visualizations are deterministically code-derived per §4; (5) outward capability gates on exactly the §5
predicate, non-forgeably; (6) auth is passwordless + enumeration-safe + per-request reload.

### Conformance package (this repo)

The npm package `nostr-agentic-identity` ships the **thin, dependency-light primitive** for the structural
half of conformance — the types, the §5 gate predicate, and a structural checker. It does **not** mint
keys, talk to relays, render vhaikus, or log anyone in — those are the heavy reference implementations that
live *under* this standard (see below). The package surface is:

| Export | Maps to | Notes |
|---|---|---|
| `Tier` (`'computed' \| 'owned'`), `TIERS` | §2 | the two tiers |
| `Custody` (`'platform' \| 'self'`), `CUSTODIES` | §2 | custody semantics |
| `AgenticIdentity` | §1–§4 | `npub`, `tier`, `custody`, `profile{handle,nip05?}`, `vhaiku?{tokenId,renders}`, `verified?`, `funded?` |
| `canActOutward(id)` | §5 | the load-bearing gate — strict `===`, byte-identical to §5 |
| `isConformant(id)` | §1–§5 | pure structural checker → `{ ok, issues[] }` |
| `describeStandard()` | this doc | the six-element list, as data |

The runtime behaviors of §1 (minting), §4 (rendering), and §6 (auth) are **out of scope** for this package
by design — it is the lightest possible peer, a checker not a composer.

## Reference implementations (under the standard, not the standard)

- **`vhaiku`** — the code-derived visualization generator (§4). Procedural default (no hosted media, no
  DiceBear); DiceBear an optional extension.
- **the identity composer** — a pure composition layer implementing §1–§5 with all I/O injected; the
  commercial tier/gate (§2, §5) rides the estate account layer, not this open standard's core.
- Primitives: `nostr-nsec-seedphrase` (keys), `nostr-crypto-utils` (crypto), the `nostr-*` auth family.

## Design note

The standard is the product; the tools are its expression. We build a fully-thought-out composer for
ourselves, but we publish the **definition** — because a standard anyone can implement outlives any one
library, and an agent that holds its own key, its own face-as-code, and its own gate is sovereign on its
own terms regardless of whose code assembled it.
