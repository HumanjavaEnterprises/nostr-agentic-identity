/**
 * Smoke test — proves the SHIPPED artifact (dist), not the source, conforms.
 *
 * Runs `canActOutward` + `isConformant` from BOTH built entry points over every
 * synthetic fixture and asserts each fixture's expected verdict:
 *   - `dist/cjs/index.js`  loaded via `require(...)`  (the CommonJS artifact)
 *   - `dist/index.js`      loaded via `import(...)`    (the ESM artifact)
 *
 * Fixtures come from `test/fixtures.mjs` — the same single source of truth the
 * vitest unit tests consume — so tests and smoke can never drift. This script is
 * dev-only: it imports from `test/`, which never ships in the package.
 *
 * Exit code is non-zero on any mismatch; a human-readable PASS/FAIL summary is
 * printed to stdout. Run via `npm run smoke` (which builds first).
 */
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const root = resolve(new URL('..', import.meta.url).pathname);

const cjsPath = resolve(root, 'dist/cjs/index.js');
const esmPath = resolve(root, 'dist/index.js');

// The CommonJS artifact, loaded exactly as a `require()` consumer would.
const cjs = require(cjsPath);
// The ESM artifact, loaded exactly as an `import` consumer would.
const esm = await import(pathToFileURL(esmPath).href);

const { allFixtures } = await import(
  pathToFileURL(resolve(root, 'test/fixtures.mjs')).href
);

/** @type {Array<{ label: string, canActOutward: Function, isConformant: Function }>} */
const targets = [
  { label: 'cjs (require dist/cjs/index.js)', canActOutward: cjs.canActOutward, isConformant: cjs.isConformant },
  { label: 'esm (import dist/index.js)', canActOutward: esm.canActOutward, isConformant: esm.isConformant },
];

let passed = 0;
let failed = 0;
const failures = [];

function check(label, description, actual, expected) {
  if (actual === expected) {
    passed += 1;
  } else {
    failed += 1;
    failures.push(`  ✗ [${label}] ${description}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

console.log('nostr-agentic-identity — smoke test over the BUILT dist');
console.log(`  fixtures: ${allFixtures.length}  ·  targets: ${targets.map((t) => t.label.split(' ')[0]).join(', ')}`);
console.log('');

for (const target of targets) {
  // Sanity: the artifact actually exports the two predicates.
  if (typeof target.canActOutward !== 'function' || typeof target.isConformant !== 'function') {
    failed += 1;
    failures.push(`  ✗ [${target.label}] missing exports (canActOutward/isConformant)`);
    continue;
  }

  for (const fx of allFixtures) {
    const conformance = target.isConformant(fx.id);
    const canAct = target.canActOutward(fx.id);

    check(target.label, `${fx.name}: isConformant.ok`, conformance.ok, fx.expect.conformant);
    check(target.label, `${fx.name}: canActOutward`, canAct, fx.expect.canAct);

    if (fx.expect.issue) {
      const joined = conformance.issues.join(' ');
      check(
        target.label,
        `${fx.name}: issues contain "${fx.expect.issue}"`,
        joined.includes(fx.expect.issue),
        true,
      );
    } else {
      // Conformant fixtures must emit zero issues.
      check(target.label, `${fx.name}: no issues`, conformance.issues.length, 0);
    }
  }
}

console.log(`Checks: ${passed} passed, ${failed} failed  (over ${allFixtures.length} fixtures × ${targets.length} targets)`);

if (failed > 0) {
  console.log('');
  console.log('FAIL — the built artifact did not match expected verdicts:');
  console.log(failures.join('\n'));
  console.log('');
  console.log('SMOKE: FAIL');
  process.exit(1);
}

console.log('');
console.log('SMOKE: PASS — the shipped package conforms over all synthetic fixtures.');
process.exit(0);
