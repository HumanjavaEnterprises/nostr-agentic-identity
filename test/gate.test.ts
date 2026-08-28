import { describe, it, expect } from 'vitest';
import { canActOutward } from '../src/gate.js';
import type { AgenticIdentity, Tier, Custody } from '../src/index.js';

/** Build an identity with the four capability-bearing fields set explicitly. */
function makeIdentity(
  tier: Tier,
  custody: Custody,
  verified: boolean,
  funded: boolean,
): AgenticIdentity {
  return {
    npub: 'npub1test',
    tier,
    custody,
    profile: { handle: 'test', ...(tier === 'owned' ? { nip05: 'test@paid.example' } : {}) },
    verified,
    funded,
  };
}

describe('canActOutward — the §5 gate over all 16 combinations', () => {
  const tiers: Tier[] = ['computed', 'owned'];
  const custodies: Custody[] = ['platform', 'self'];
  const bools = [false, true];

  const cases: Array<{
    tier: Tier;
    custody: Custody;
    verified: boolean;
    funded: boolean;
    expected: boolean;
  }> = [];

  for (const tier of tiers) {
    for (const custody of custodies) {
      for (const verified of bools) {
        for (const funded of bools) {
          // True on EXACTLY owned + self + verified + funded.
          const expected =
            tier === 'owned' && custody === 'self' && verified === true && funded === true;
          cases.push({ tier, custody, verified, funded, expected });
        }
      }
    }
  }

  it('enumerates exactly 16 combinations', () => {
    expect(cases).toHaveLength(16);
  });

  it('returns true for exactly one combination', () => {
    expect(cases.filter((c) => c.expected)).toHaveLength(1);
  });

  it.each(cases)(
    'tier=$tier custody=$custody verified=$verified funded=$funded -> $expected',
    ({ tier, custody, verified, funded, expected }) => {
      const id = makeIdentity(tier, custody, verified, funded);
      expect(canActOutward(id)).toBe(expected);
    },
  );

  it('the one passing case is owned + self + verified + funded', () => {
    expect(canActOutward(makeIdentity('owned', 'self', true, true))).toBe(true);
  });
});

describe('canActOutward — strict === (no coercion)', () => {
  const base: AgenticIdentity = {
    npub: 'npub1test',
    tier: 'owned',
    custody: 'self',
    profile: { handle: 'test', nip05: 'test@paid.example' },
    verified: true,
    funded: true,
  };

  it('rejects verified: 1 (truthy but not === true)', () => {
    expect(canActOutward({ ...base, verified: 1 as unknown as boolean })).toBe(false);
  });

  it("rejects verified: 'yes' (truthy but not === true)", () => {
    expect(canActOutward({ ...base, verified: 'yes' as unknown as boolean })).toBe(false);
  });

  it('rejects funded: 1 (truthy but not === true)', () => {
    expect(canActOutward({ ...base, funded: 1 as unknown as boolean })).toBe(false);
  });

  it("rejects funded: 'true' (truthy but not === true)", () => {
    expect(canActOutward({ ...base, funded: 'true' as unknown as boolean })).toBe(false);
  });

  it('rejects missing verified/funded (undefined)', () => {
    const { verified: _v, funded: _f, ...noFlags } = base;
    expect(canActOutward(noFlags as AgenticIdentity)).toBe(false);
  });
});
