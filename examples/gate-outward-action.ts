/**
 * Act-outward gate example — nostr-agentic-identity
 *
 * Demonstrates the load-bearing §5 predicate: an identity may act outward only when it is
 * owned + self-custody + verified + funded. A computed identity is structurally inert.
 */
import { canActOutward, type AgenticIdentity } from 'nostr-agentic-identity';

const owned: AgenticIdentity = {
  npub: 'npub1ownedexample',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada', nip05: 'ada@paid.example' },
  verified: true,
  funded: true,
};

const free: AgenticIdentity = {
  npub: 'npub1computedexample',
  tier: 'computed',
  custody: 'platform',
  profile: { handle: 'guest-4f2a' },
};

console.log('owned can act outward:', canActOutward(owned)); // true
console.log('computed can act outward:', canActOutward(free)); // false

// Strict ===: a truthy-but-non-true value never passes the gate.
const spoofed = { ...owned, verified: 1 as unknown as boolean };
console.log('spoofed (verified: 1) can act outward:', canActOutward(spoofed)); // false

// Enforce at the trust boundary — call canActOutward on an identity you re-loaded from your
// own store of record, never on a caller-supplied object.
if (canActOutward(owned)) {
  console.log('-> sending the email / placing the call / publishing on its behalf');
}
