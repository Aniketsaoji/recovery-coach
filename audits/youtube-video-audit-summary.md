# YouTube Video Audit

Audited: 2026-05-18

## Result

- Exercises audited: 50
- Previous video mappings: 4
- Previous working mappings: 3
- Previous broken mappings: 1
- New video mappings: 50
- Final working mappings: 50
- Final broken mappings: 0

## Broken Video Replaced

- `dead-bug`
  - Old ID: `ocCurcR5leY`
  - Old status: YouTube oEmbed `403`
  - New ID: `o4GKiEoYClI`
  - New title: `Dead Bug Exercise For Core Stability | Pursuit Physical Therapy`

## Audit Method

1. Enumerated all exercise IDs from `src/data/exercises.js`.
2. Checked existing video IDs with YouTube oEmbed.
3. Searched YouTube for candidates using each exercise query.
4. Verified candidate IDs with YouTube oEmbed.
5. Manually swapped a few technically-working but weaker candidates for better matches.
6. Rechecked every final mapped video ID.

Detailed machine-readable output is in `audits/youtube-video-audit.json`.
