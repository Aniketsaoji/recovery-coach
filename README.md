# PT Guide

A React/Vite playground project for making physical therapy easier by building simple exercise routines from body area, goal, and available time.

## Features

- Interactive body map for selecting one or more focus areas
- Goal and time controls for building a routine
- Exercise search by body area, goal, pain type, equipment, difficulty, exercise name, and video source
- Verified YouTube demo video mappings for the current exercise catalog
- Light and dark themes

## Run Locally

```bash
npm install
npm run dev
```

Vite will print a local URL, usually `http://localhost:5173`.

## Build

```bash
npm run build
```

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. Push the repo to GitHub.
2. In GitHub, go to `Settings` -> `Pages`.
3. Set `Build and deployment` -> `Source` to `GitHub Actions`.
4. Push to the `main` branch.

The workflow installs dependencies, runs `npm run build`, and deploys the generated `dist` folder to GitHub Pages.

## Notes

- This project is an exercise discovery prototype, not medical advice.
- Large local experiments, generated build output, dependency folders, and local tool settings are intentionally ignored in `.gitignore`.
- The YouTube audit summary is in `audits/youtube-video-audit-summary.md`.
