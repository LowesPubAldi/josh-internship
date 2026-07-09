# Ultraverse NFT Marketplace v1.0.0

Release date: 2026-07-08

## Highlights

- Upgraded the NFT marketplace from template-level behavior to portfolio-ready UX with resilient data loading and cleaner interactions.
- Added CI checks so tests and production builds are validated automatically on pushes and pull requests.
- Added smoke tests for critical app flows.

## New

- Shared reusable error notice component for API failure states.
- CI workflow in GitHub Actions to run test/build on `main` pushes and PRs.
- CI-friendly test command: `npm run test:ci`.
- App smoke test suite covering navigation visibility and `/item-details` redirect behavior.
- Release checklist and improved project story/documentation in README.

## Changed

- Explore, New Items, Hot Collections, Top Sellers, Author page, Author items, and Item details now handle fetch failures with consistent user-facing notices.
- Dead/invalid links and placeholder artifacts were removed from core user flows.
- Route safety improved: `/item-details` now redirects to `/explore` when no NFT id is provided.
- Navigation and footer interactions were cleaned up for accessibility and polish.
- Head metadata improved in `public/index.html` and conflicting Bootstrap includes were removed.

## Quality and Verification

- Tests: `npm run test:ci` passed.
- Build: `npm run build` passed.
- Live deploy: https://lowespubaldi.github.io/josh-internship/

## Known Limitations

- Wallet connect remains UI-only in this release.
- Data depends on public demo APIs and may be intermittently unavailable.