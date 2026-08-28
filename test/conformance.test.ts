import { describe, it, expect } from 'vitest';
import { isConformant, describeStandard } from '../src/conformance.js';
import { canActOutward } from '../src/gate.js';
import type { AgenticIdentity } from '../src/index.js';
// The synthetic fixtures are the single source of truth shared with scripts/smoke.mjs.
// They are plain-data ESM JS (see test/fixtures.mjs for why) — cast to the typed shape here.
import { validFixtures, invalidFixtures } from './fixtures.mjs';

type Fixture = {
  name: string;
  id: AgenticIdentity;
  expect: { conformant: boolean; canAct: boolean; issue: string | null };
};

const valid = validFixtures as Fixture[];
const invalid = invalidFixtures as Fixture[];

describe('isConformant — accepts (valid fixtures)', () => {
  it.each(valid)('$name is conformant with no issues', (fx) => {
    expect(isConformant(fx.id)).toEqual({ ok: true, issues: [] });
  });
});

describe('isConformant — rejects (malformed fixtures)', () => {
  it.each(invalid)('$name is rejected with its expected issue', (fx) => {
    const r = isConformant(fx.id);
    expect(r.ok).toBe(false);
    expect(fx.expect.issue).toBeTruthy();
    expect(r.issues.join(' ')).toContain(fx.expect.issue as string);
  });
});

describe('conformance <-> gate consistency (every fixture)', () => {
  it.each([...valid, ...invalid])(
    '$name: canActOutward matches its expected verdict',
    (fx) => {
      expect(canActOutward(fx.id)).toBe(fx.expect.canAct);
    },
  );

  it('a conformant computed identity can never act outward', () => {
    const computed = valid.find((f) => f.name === 'computedValid')!;
    expect(isConformant(computed.id).ok).toBe(true);
    expect(canActOutward(computed.id)).toBe(false);
  });

  it('a conformant fully-provisioned owned identity can act outward', () => {
    const owned = valid.find((f) => f.name === 'ownedValid')!;
    expect(isConformant(owned.id).ok).toBe(true);
    expect(canActOutward(owned.id)).toBe(true);
  });

  it('the forged-custody computed actor is rejected AND cannot act', () => {
    // A computed identity dressed up as self+verified+funded: the platform-custody
    // rule keeps it non-conformant, and the gate still denies it.
    const forged = invalid.find((f) => f.name === 'computedForgedActor')!;
    const r = isConformant(forged.id);
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toMatch(/platform-custodied/);
    expect(canActOutward(forged.id)).toBe(false);
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
