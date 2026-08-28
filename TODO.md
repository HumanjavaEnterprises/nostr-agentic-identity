# TODO — nostr-agentic-identity

## Before first npm publish

- [ ] Confirm the npm package name `nostr-agentic-identity` is available / reserved.
- [ ] Verify the `HumanjavaEnterprises/nostr-agentic-identity` GitHub repo, CI badge slug (`ci.yml`),
      and `FUNDING.yml` handles are correct.
- [ ] Decide whether to commit generated `docs/` (as the seedphrase peer does) or leave to CI.

## Later

- [ ] Publish the reference implementations that ride under the standard (`vhaiku`, the identity
      composer) and cross-link them from SPEC.md.
- [ ] Add a machine-readable conformance fixture set (valid/invalid identity vectors) that consumers
      and other implementations can test against — the analog of the peer's `test/vectors/`.
