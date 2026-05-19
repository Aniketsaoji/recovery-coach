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

## Notes

- This project is an exercise discovery prototype, not medical advice.
- Large local experiments, generated build output, dependency folders, and local tool settings are intentionally ignored in `.gitignore`.
- The YouTube audit summary is in `audits/youtube-video-audit-summary.md`.
