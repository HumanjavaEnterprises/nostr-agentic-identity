import { describe, it, expect, afterEach } from 'vitest';
import { isConformant, describeStandard } from '../src/conformance.js';
import { canActOutward } from '../src/gate.js';
import { isValidNpub } from '../src/npub.js';
import { TIERS, CUSTODIES } from '../src/types.js';

// NIP-19 published test vector (public key, not a secret).
const NIP19_NPUB = 'npub10elfcs4fr0l0r8af98jlmgdh9c8tcxjvz9qkw038js35mp4dma8qzvjptg';
const VALID = 'npub1z5q4k0mj8jvelrfdpcl298vry6c9tq6tggnv0mz7ufmeg8c5d38swpv7wd';

describe('isValidNpub (internal, SPEC §1)', () => {
  it('accepts the NIP-19 test vector and a generated npub', () => {
    expect(isValidNpub(NIP19_NPUB)).toBe(true);
    expect(isValidNpub(VALID)).toBe(true);
  });

  it.each([
    ['empty', ''],
    ['placeholder', 'npub1...'],
    ['not bech32', 'not-an-npub'],
    ['bad checksum', VALID.slice(0, -1) + 'q'],
    ['uppercase (non-canonical)', NIP19_NPUB.toUpperCase()],
    ['mixed case', 'N' + NIP19_NPUB.slice(1)],
    ['nsec prefix', 'nsec194c3vs4hy6cygqtz0j5lhtpj7hy9xra3jq7vfkczykr30ys6fzqs7qqm39'],
    ['31-byte payload', 'npub194c3vs4hy6cygqtz0j5lhtpj7hy9xra3jq7vfkczykr30ys6fqjnq85f'],
    ['33-byte payload', 'npub194c3vs4hy6cygqtz0j5lhtpj7hy9xra3jq7vfkczykr30ys6fzqszr2j0yj'],
    ['hex pubkey', '7e7e9c42a91bfef19fa929e5fda1b72e0ebc1a4c1141673e2794234d86addf4e'],
    ['char outside charset', VALID.slice(0, 10) + 'b' + VALID.slice(11)],
  ])('rejects %s', (_label, value) => {
    expect(isValidNpub(value)).toBe(false);
  });

  it.each([null, undefined, 42, {}, [], Symbol('x')])('rejects non-string %s without throwing', (v) => {
    expect(isValidNpub(v)).toBe(false);
  });
});

describe('isConformant validates the npub (SPEC §1)', () => {
  it('rejects the review repro: a non-bech32 npub', () => {
    const r = isConformant({
      npub: 'not-an-npub',
      tier: 'computed',
      custody: 'platform',
      profile: { handle: 'x' },
    });
    expect(r.ok).toBe(false);
    expect(r.issues.join(' ')).toContain('npub must be a bech32 npub');
  });

  it('accepts a valid npub', () => {
    expect(
      isConformant({ npub: VALID, tier: 'computed', custody: 'platform', profile: { handle: 'x' } }),
    ).toEqual({ ok: true, issues: [] });
  });

  it('looseNpub opt-in restores the 0.1.x non-empty-string rule', () => {
    const id = { npub: 'npub1placeholder', tier: 'computed', custody: 'platform', profile: { handle: 'x' } } as const;
    expect(isConformant(id, { looseNpub: true }).ok).toBe(true);
    expect(isConformant({ ...id, npub: '' }, { looseNpub: true }).ok).toBe(false);
  });
});

// Every exported function must fail closed and never throw on bad input.
const garbage: unknown[] = [
  null,
  undefined,
  0,
  1,
  NaN,
  '',
  'owned',
  true,
  Symbol('id'),
  [],
  ['owned', 'self'],
  () => true,
  {},
  { tier: 'owned' },
  { npub: VALID, tier: 'owned', custody: 'self', profile: null, vhaiku: null },
  { npub: VALID, tier: 'owned', custody: 'self', profile: 'ada' },
  { npub: VALID, tier: 'owned', custody: 'self', profile: { handle: 1, nip05: {} } },
  { npub: VALID, tier: 'owned', custody: 'self', profile: { handle: 'a', nip05: 'a@b' }, vhaiku: 'x' },
  { npub: VALID, tier: 'owned', custody: 'self', profile: { handle: 'a', nip05: 'a@b' }, vhaiku: { renders: 'abc' } },
  { npub: { toString: () => VALID }, tier: ['owned'], custody: ['self'], profile: [] },
  Object.create(null),
  new Proxy(
    {},
    {
      get() {
        throw new Error('hostile getter');
      },
    },
  ),
  Object.defineProperty({ tier: 'owned', custody: 'self', verified: true }, 'funded', {
    get() {
      throw new Error('hostile getter');
    },
  }),
];

describe('canActOutward fails closed on bad input', () => {
  it.each(garbage.map((g, i) => [i, g]))('returns false, never throws: garbage[%i]', (_i, g) => {
    expect(() => canActOutward(g as never)).not.toThrow();
    expect(canActOutward(g as never)).toBe(false);
  });

  it('still returns true for a fully provisioned owned identity', () => {
    expect(
      canActOutward({
        npub: VALID,
        tier: 'owned',
        custody: 'self',
        profile: { handle: 'a', nip05: 'a@b' },
        verified: true,
        funded: true,
      }),
    ).toBe(true);
  });
});

describe('isConformant fails closed on bad input', () => {
  it.each(garbage.map((g, i) => [i, g]))('returns ok:false with issues, never throws: garbage[%i]', (_i, g) => {
    expect(() => isConformant(g as never)).not.toThrow();
    const r = isConformant(g as never);
    expect(r.ok).toBe(false);
    expect(r.issues.length).toBeGreaterThan(0);
  });

  it.each([null, 'x', 42, []])('tolerates a bad options argument: %s', (opts) => {
    expect(() =>
      isConformant({ npub: VALID, tier: 'computed', custody: 'platform', profile: { handle: 'x' } }, opts as never),
    ).not.toThrow();
  });
});

describe('describeStandard ignores arguments and returns fresh data', () => {
  it('a caller mutating the result does not affect the next call', () => {
    const a = describeStandard();
    a[0].title = 'mutated';
    a.pop();
    expect(describeStandard()).toHaveLength(6);
    expect(describeStandard()[0].title).toBe('Identity root');
  });
});

// ---- Checker nits (2026-11-10): own properties only, arrays denied, frozen enums, pinned edges ----

const OWNED_FIELDS = { tier: 'owned', custody: 'self', verified: true, funded: true };
const POLLUTED_KEYS = ['tier', 'custody', 'verified', 'funded', 'looseNpub'] as const;

describe('only own properties are read (no inherited capability)', () => {
  afterEach(() => {
    for (const k of POLLUTED_KEYS) delete (Object.prototype as Record<string, unknown>)[k];
  });

  it('canActOutward denies capability fields inherited from a prototype', () => {
    expect(canActOutward(Object.create(OWNED_FIELDS))).toBe(false);
  });

  it('canActOutward denies {} / JSON.parse("{}") / [] under a polluted Object.prototype', () => {
    Object.assign(Object.prototype, OWNED_FIELDS);
    expect(canActOutward({} as never)).toBe(false);
    expect(canActOutward(JSON.parse('{}'))).toBe(false);
    expect(canActOutward([] as never)).toBe(false);
  });

  it('isConformant does not accept fields inherited from a prototype', () => {
    const proto = { npub: VALID, tier: 'computed', custody: 'platform', profile: { handle: 'x' } };
    expect(isConformant(Object.create(proto)).ok).toBe(false);
    const nested = { npub: VALID, tier: 'computed', custody: 'platform', profile: Object.create({ handle: 'x' }) };
    expect(isConformant(nested).ok).toBe(false);
  });

  it('a polluted Object.prototype.looseNpub does not turn the npub rule off', () => {
    (Object.prototype as Record<string, unknown>).looseNpub = true;
    const id = { npub: 'not-an-npub', tier: 'computed', custody: 'platform', profile: { handle: 'x' } } as const;
    expect(isConformant(id, {}).ok).toBe(false);
    expect(isConformant(id).ok).toBe(false);
  });

  it('own-property identities still pass', () => {
    expect(canActOutward({ npub: VALID, profile: { handle: 'a', nip05: 'a@b' }, ...OWNED_FIELDS } as never)).toBe(true);
  });
});

describe('arrays are denied by the gate', () => {
  it('an array carrying the capability fields as own properties is denied', () => {
    const arr = Object.assign([], OWNED_FIELDS);
    expect(canActOutward(arr as never)).toBe(false);
  });
});

describe('TIERS and CUSTODIES are frozen', () => {
  it('cannot be extended to widen what isConformant accepts', () => {
    expect(Object.isFrozen(TIERS)).toBe(true);
    expect(Object.isFrozen(CUSTODIES)).toBe(true);
    expect(() => (TIERS as unknown as string[]).push('root')).toThrow();
    expect(() => (CUSTODIES as unknown as string[]).push('root')).toThrow();
    const r = isConformant({ npub: VALID, tier: 'root', custody: 'root', profile: { handle: 'x' } } as never);
    expect(r.ok).toBe(false);
  });
});

describe('pinned edges', () => {
  it('rejects an npub whose padding bits are non-zero (checksum recomputed)', () => {
    // 32 bytes = 256 bits -> 52 words (260 bits): the last word carries 4 padding bits.
    // Flip the low padding bit of the last data word and recompute a valid checksum.
    const C = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
    const G = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
    const pm = (v: number[]) => {
      let c = 1;
      for (const x of v) {
        const t = c >>> 25;
        c = ((c & 0x1ffffff) << 5) ^ x;
        for (let i = 0; i < 5; i++) if ((t >>> i) & 1) c ^= G[i];
      }
      return c;
    };
    const hrp = [3, 3, 3, 3, 0, 14, 16, 21, 2]; // 'npub' expanded
    const words = [...VALID.slice(5, -6)].map((ch) => C.indexOf(ch));
    expect(words).toHaveLength(52);
    words[51] ^= 1;
    const p = pm([...hrp, ...words, 0, 0, 0, 0, 0, 0]) ^ 1;
    const cs = [0, 1, 2, 3, 4, 5].map((i) => (p >>> (5 * (5 - i))) & 31);
    const tampered = 'npub1' + [...words, ...cs].map((w) => C[w]).join('');
    expect(pm([...hrp, ...words, ...cs])).toBe(1); // checksum is valid
    expect(isValidNpub(tampered)).toBe(false);
  });

  it.each([1, 'true', 'yes', {}])('looseNpub only for strict true, not %s', (v) => {
    const id = { npub: 'npub1placeholder', tier: 'computed', custody: 'platform', profile: { handle: 'x' } } as const;
    expect(isConformant(id, { looseNpub: v } as never).ok).toBe(false);
  });
});
