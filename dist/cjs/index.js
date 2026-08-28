"use strict";
/**
 * nostr-agentic-identity — the thin conformance primitive for the agentic identity standard.
 *
 * The authoritative standard is SPEC.md. This package ships the types, the act-outward gate
 * predicate (§5), and a pure structural conformance checker — nothing heavy. It does not mint
 * keys, talk to relays, render vhaikus, or log anyone in.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeStandard = exports.isConformant = exports.canActOutward = exports.CUSTODIES = exports.TIERS = void 0;
var types_js_1 = require("./types.js");
Object.defineProperty(exports, "TIERS", { enumerable: true, get: function () { return types_js_1.TIERS; } });
Object.defineProperty(exports, "CUSTODIES", { enumerable: true, get: function () { return types_js_1.CUSTODIES; } });
var gate_js_1 = require("./gate.js");
Object.defineProperty(exports, "canActOutward", { enumerable: true, get: function () { return gate_js_1.canActOutward; } });
var conformance_js_1 = require("./conformance.js");
Object.defineProperty(exports, "isConformant", { enumerable: true, get: function () { return conformance_js_1.isConformant; } });
Object.defineProperty(exports, "describeStandard", { enumerable: true, get: function () { return conformance_js_1.describeStandard; } });
