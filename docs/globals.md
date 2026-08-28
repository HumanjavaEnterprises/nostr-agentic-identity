[**nostr-agentic-identity v0.1.0**](README.md)

***

# nostr-agentic-identity v0.1.0

nostr-agentic-identity — the thin conformance primitive for the agentic identity standard.

The authoritative standard is SPEC.md. This package ships the types, the act-outward gate
predicate (§5), and a pure structural conformance checker — nothing heavy. It does not mint
keys, talk to relays, render vhaikus, or log anyone in.

## Interfaces

- [AgenticIdentity](interfaces/AgenticIdentity.md)
- [ConformanceResult](interfaces/ConformanceResult.md)
- [Profile](interfaces/Profile.md)
- [StandardElement](interfaces/StandardElement.md)
- [Vhaiku](interfaces/Vhaiku.md)

## Type Aliases

- [Custody](type-aliases/Custody.md)
- [Tier](type-aliases/Tier.md)

## Variables

- [CUSTODIES](variables/CUSTODIES.md)
- [TIERS](variables/TIERS.md)

## Functions

- [canActOutward](functions/canActOutward.md)
- [describeStandard](functions/describeStandard.md)
- [isConformant](functions/isConformant.md)
