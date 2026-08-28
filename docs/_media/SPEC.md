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

### 2. Two tiers — computed and owned
An identity is one of two tiers, and the distinction is **custody**:

| | **computed** | **owned** |
|---|---|---|
| Key | derived deterministically from a platform seed | freshly minted by the holder |
| Custody | `platform` (the holder never receives an nsec) | `self` (nsec handed over **once**, never stored) |
| Handle | provider-scoped | NIP-05 binding on a domain the holder or its provider controls |
| Accountability | none established | `verified` + `funded` (§5) |
| **Can act outward** | **no** | **yes** (§5) |

A **computed** identity is reachable, displayable, real — but *inert*. It exists so an agent can be
seen and addressed before anyone has vouched for it. Moving to **owned** is a deliberate step, and it
is a **re-mint**: a fresh key is generated under the holder's control (the computed key was
platform-derived and never theirs), and activity re-points from the old `npub` to the new one via a
`{from, to}` remap.

> **The standard does not say what either tier costs.** Whether a tier is free, paid, invite-only, or
> internal to one deployment is entirely the implementer's decision. Conformance turns on *custody* and
> *accountability*, never on a price model.

### 3. Profile — the identity's DATA
Handle + metadata, published as a Nostr **kind-0** event signed by the identity's key. Owned identities
carry a **NIP-05** binding on a domain under the holder's or its provider's control; computed identities
carry only a provider-scoped handle. The profile is DATA — distinct from its visualization (§4).

### 4. Vhaiku — a visualization *derived from the npub by code*
A **vhaiku** is a visual rendering of a profile (avatar, banner, mark, isometric). The standard's
principle: **a vhaiku is computed deterministically from the identity's key — it is not a hosted image.**
It persists as long as the seed and a conforming generator exist: no CDN, no PNG to rot, no external
hosting. Any deterministic generator conforms — pure procedural, or a deterministic avatar library.

> This is a first-class value of the standard, not an implementation detail: **identity art is code, not
> media.** It's how an agent's face survives without a server hosting it.

### 5. The act-outward gate
An identity may perform an **outward** action (send email, place a call, publish on its behalf) **only
when**:

```
canActOutward(id)  ==  id.tier === 'owned'
                    && id.custody === 'self'
                    && id.verified === true
                    && id.funded  === true
```

A **computed** identity is structurally unable to pass this — it is never `owned`, never `self`-custody.
So an identity that no one has vouched for can be *seen and reached* but never *acts*.

This predicate is an **authorization and abuse-control boundary**. `verified` and `funded` are what make
outward action attributable and costly: an anonymous, unbacked identity cannot send, call, or publish on
someone's behalf. The standard does **not** prescribe how an implementation establishes either signal —
only that outward capability gates on exactly this predicate, and that it does so non-forgeably. Never
evaluate it against a caller-supplied or deserialized identity object; the capability-bearing fields MUST
be non-forgeable at the trust boundary.

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
- **Not an open anonymous mint.** The holder self-generates its key, and a conforming platform does not
  grant outward capability to identities with no accountability established (§5). *How* an implementation
  establishes accountability is its own choice.
- **Not custody.** An owned `nsec` is handed to the holder once and never retained.
- **Not a business model.** The standard is silent on pricing, packaging, and tiering economics. Two
  conforming implementations may make opposite commercial choices.
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
keys, talk to relays, render vhaikus, or log anyone in — those are heavier implementations that live
*under* this standard. The package surface is:

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

## Implementing the standard

The standard is deliberately implementable from this document alone. Building blocks that already exist,
should you want them:

- **Keys** — `nostr-nsec-seedphrase` (§1 minting, seed derivation).
- **Crypto** — `nostr-crypto-utils`.
- **Auth** — `nostr-auth-middleware`, `nostr-dm-magiclink-utils`, `nostr-biometric-auth-utils` (§6).
- **Visualization** — any deterministic, code-derived generator satisfies §4; none is privileged by the
  standard.

## Design note

The standard is the product; the tools are its expression. A definition anyone can implement outlives any
one library — and an agent that holds its own key, its own face-as-code, and its own gate is sovereign on
its own terms regardless of whose code assembled it.
