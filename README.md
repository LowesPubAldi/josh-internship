# Ultraverse NFT Marketplace

A React-based NFT marketplace frontend that displays featured collections, new listings, top sellers, creator profiles, and item detail pages.

![React](https://img.shields.io/badge/React-17-61DAFB?logo=react&logoColor=white)
![Router](https://img.shields.io/badge/Router-v6-CA4245)
![Build](https://img.shields.io/badge/build-passing-brightgreen)

## Demo

- Local URL: http://localhost:3000
- Live deploy: https://lowespubaldi.github.io/josh-internship/
- Vercel deploy: https://josh-internship.vercel.app/
- Primary routes: /, /explore, /author/:id, /item-details/:nftId

## Screenshots

### Home Hero

![Ultraverse logo and home hero](src/images/Ultraverse.png)

### Marketplace Card View

![NFT card preview](src/images/nft.png)

### Item Art Preview

![NFT artwork preview](src/images/nftImage.jpg)

### Creator Profile Banner

![Author profile banner](src/images/author_banner.jpg)

## Highlights

- Multi-page navigation with React Router
- Dynamic NFT data pulled from hosted cloud function endpoints
- Loading skeletons for better perceived performance
- Countdown timers for expiring listings
- Responsive layouts for desktop and mobile

## Tech Stack

- React 17
- React Router 6
- Axios + Fetch API
- AOS animations
- Owl Carousel
- Bootstrap utility/layout classes

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
```

The production bundle is generated in the build folder.

## Quality Gates

- Unit smoke tests: npm run test:ci
- Production build check: npm run build
- GitHub Actions CI on push and pull requests to main

## Release Checklist

1. Pull latest main and install dependencies with npm ci.
2. Run quality gates locally: npm run test:ci and npm run build.
3. Push branch and confirm GitHub Actions CI is green.
4. Deploy latest build to production target.
5. Smoke-test live routes:
	- /
	- /explore
	- /item-details (redirect behavior)
	- /item-details/<valid-nft-id>
	- /author/<valid-author-id>
6. Verify API-backed sections render and graceful error notices appear if endpoints fail.
7. Tag release in git (example: v1.0.0) and publish release notes summarizing user-facing changes.

## Project Story

This project started as a template-based NFT UI and was iterated into a portfolio-ready frontend with stronger reliability and clearer UX.

### What Was Improved

- Removed placeholder and dead-link behavior that made the app feel unfinished
- Added resilient fetch error handling with consistent user-facing error notices
- Added route-safe behavior for invalid item detail paths
- Added smoke tests for critical navigation and redirect behavior
- Added CI automation to enforce test/build checks on every PR and push

### Tradeoffs

- Wallet connection is intentionally UI-only in this version (no web3 provider integration yet)
- Data relies on public demo APIs, which can be rate-limited or intermittently unavailable

## Project Structure

- src/pages: Route-level pages
- src/components: Shared and section components
- src/components/home: Home page blocks
- src/components/explore: Explore listing UI
- src/components/author: Author profile listing UI
- public: HTML shell and static metadata

## Notes

- This project currently uses public demo APIs for NFT/author data.
- Wallet connect and transaction flow are UI-only and not yet integrated with a real web3 provider.
