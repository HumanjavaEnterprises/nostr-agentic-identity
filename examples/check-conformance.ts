/**
 * Conformance checker example — nostr-agentic-identity
 *
 * Demonstrates the pure structural checker isConformant() and describeStandard().
 */
import {
  isConformant,
  describeStandard,
  type AgenticIdentity,
} from 'nostr-agentic-identity';

// A conformant owned identity: self-custody + NIP-05 bound.
const owned: AgenticIdentity = {
  npub: 'npub1ownedexample',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada', nip05: 'ada@paid.example' },
  verified: true,
  funded: true,
};
console.log('owned:', isConformant(owned)); // { ok: true, issues: [] }

// A non-conformant owned identity: missing the required NIP-05.
const missingNip05: AgenticIdentity = {
  npub: 'npub1ownedexample',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada' },
};
console.log('owned w/o nip05:', isConformant(missingNip05));
// { ok: false, issues: ['owned identity must bind a NIP-05 (profile.nip05) (SPEC §3)'] }

// The six elements of the standard, as data.
console.log('\nThe standard:');
for (const element of describeStandard()) {
  console.log(`  ${element.n}. ${element.title} — ${element.summary}`);
}
