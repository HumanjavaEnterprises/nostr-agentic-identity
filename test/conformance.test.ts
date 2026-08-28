import { describe, it, expect } from 'vitest';
import { isConformant, describeStandard } from '../src/conformance.js';
import { canActOutward } from '../src/gate.js';
import type { AgenticIdentity } from '../src/index.js';

const validOwned: AgenticIdentity = {
  npub: 'npub1owned',
  tier: 'owned',
  custody: 'self',
  profile: { handle: 'ada', nip05: 'ada@paid.example' },
  verified: true,
  funded: true,
};

const validComputed: AgenticIdentity = {
  npub: 'npub1computed',
  tier: 'computed',
  custody: 'platform',
  profile: { handle: 'guest-4f2a' },
};

describe('isConformant — accepts', () => {
  it('a valid owned identity', () => {
    expect(isConformant(validOwned)).toEqual({ ok: true, issues: [] });
  });

  it('a valid computed identity', () => {
    expect(isConformant(validComputed)).toEqual({ ok: true, issues: [] });
  });

  it('a valid owned identity carrying a vhaiku', () => {
    const r = isConformant({
      ...validOwned,
      vhaiku: { tokenId: 'tok1', renders: ['avatar', 'banner'] },
    });
    expect(r.ok).toBe(true);
  });
});

describe('isConformant — rejects', () => {
  it('owned without a NIP-05', () => {
    const r = isConformant({ ...validOwned, profile: { handle: 'ada' } });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/NIP-05/);
  });

  it('computed WITH a NIP-05', () => {
    const r = isConformant({
      ...validComputed,
      profile: { handle: 'guest', nip05: 'guest@paid.example' },
    });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/must not bind a NIP-05/);
  });

  it('owned with platform custody', () => {
    const r = isConformant({ ...validOwned, custody: 'platform' });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/self-custodied/);
  });

  it('computed with self custody', () => {
    const r = isConformant({ ...validComputed, custody: 'self' });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/platform-custodied/);
  });

  it('an invalid tier', () => {
    const r = isConformant({ ...validOwned, tier: 'premium' as unknown as AgenticIdentity['tier'] });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/tier must be one of/);
  });

  it('an invalid custody', () => {
    const r = isConformant({
      ...validOwned,
      custody: 'escrow' as unknown as AgenticIdentity['custody'],
    });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/custody must be one of/);
  });

  it('an empty npub', () => {
    const r = isConformant({ ...validOwned, npub: '' });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/npub/);
  });

  it('an empty handle', () => {
    const r = isConformant({ ...validOwned, profile: { handle: '', nip05: 'x@paid.example' } });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/profile\.handle/);
  });

  it('a computed identity dressed up to act (self + verified + funded)', () => {
    // The platform-custody rule is what keeps a computed identity structurally inert:
    // canActOutward requires owned+self, so no conformant computed identity can ever act.
    const r = isConformant({
      ...validComputed,
      custody: 'self',
      verified: true,
      funded: true,
    });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/platform-custodied/);
    // And even in this non-conformant shape, the gate still denies it.
    expect(canActOutward({ ...validComputed, custody: 'self', verified: true, funded: true })).toBe(
      false,
    );
  });

  it('a vhaiku with empty renders', () => {
    const r = isConformant({ ...validOwned, vhaiku: { tokenId: 'tok1', renders: [] } });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/vhaiku\.renders/);
  });
});

describe('conformance <-> gate consistency', () => {
  it('a conformant computed identity can never act outward', () => {
    expect(isConformant(validComputed).ok).toBe(true);
    expect(canActOutward(validComputed)).toBe(false);
  });

  it('a conformant fully-provisioned owned identity can act outward', () => {
    expect(isConformant(validOwned).ok).toBe(true);
    expect(canActOutward(validOwned)).toBe(true);
  });
});

describe('describeStandard', () => {
  it('returns the six elements in order', () => {
    const elements = describeStandard();
    expect(elements).toHaveLength(6);
    expect(elements.map((e) => e.n)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(elements[4].title).toMatch(/gate/i);
  });
});
