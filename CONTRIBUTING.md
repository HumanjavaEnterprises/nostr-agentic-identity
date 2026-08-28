# Contributing to nostr-agentic-identity

First off, thank you for considering contributing! This package is the thin conformance primitive for the
agentic identity standard — the authoritative definition lives in [SPEC.md](SPEC.md).

## A note on scope

This package is **deliberately light**: types, the act-outward gate predicate, and a pure structural
conformance checker — with **zero runtime dependencies**. Please keep it that way. Key minting, relay/DB
I/O, vhaiku generation, and auth belong in the reference implementations *under* the standard, not here.
Changes that alter the meaning of `canActOutward` or a conformance rule are **standard changes** — they
must be reflected in SPEC.md first, and are effectively breaking.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include any error messages or logs

### Suggesting Enhancements

If you have a suggestion for the library, we'd love to hear about it. Before creating enhancement suggestions, please check the issue list as you might find out that you don't need to create one.

When you are creating an enhancement suggestion, please include as many details as possible:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript styleguide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Write your code
4. Write or update tests as needed
5. Run the test suite
6. Push your changes
7. Submit a pull request

## Testing

We use Vitest for testing. Please ensure all tests pass before submitting a pull request:

```bash
npm test
```

## Style Guide

* Use TypeScript
* Follow the existing code style
* Write descriptive commit messages
* Document your code with JSDoc comments

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
