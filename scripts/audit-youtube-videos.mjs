import { writeFile } from 'node:fs/promises'
import { EXERCISES } from '../src/data/exercises.js'
import { getExerciseVideo } from '../src/data/youtubeVideos.js'

const MAX_CANDIDATES = 8
const TRUSTED_SOURCE_HINTS = [
  'physio',
  'physical therapy',
  'pt',
  'clinic',
  'hospital',
  'health',
  'nhs',
  'ortho',
  'spine',
  'rehab',
]

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

function getTokens(text) {
  return normalize(text)
    .split(/\s+/)
    .filter((token) => token.length > 2 && !['the', 'and', 'for', 'with', 'how'].includes(token))
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/125 Safari/537.36',
      'accept-language': 'en-US,en;q=0.9',
    },
  })
  const text = await response.text()
  return { status: response.status, text }
}

async function checkVideo(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  try {
    const { status, text } = await fetchText(url)
    if (status !== 200) return { ok: false, status, id: videoId }
    const payload = JSON.parse(text)
    return {
      ok: true,
      status,
      id: videoId,
      title: payload.title,
      source: payload.author_name,
      authorUrl: payload.author_url,
    }
  } catch (error) {
    return { ok: false, status: 'error', id: videoId, error: error.message }
  }
}

async function searchCandidates(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
  const { status, text } = await fetchText(url)
  if (status !== 200) return []
  const ids = []
  for (const match of text.matchAll(/"videoId":"([^"]+)"/g)) {
    if (!ids.includes(match[1])) ids.push(match[1])
    if (ids.length >= MAX_CANDIDATES) break
  }
  return ids
}

function scoreCandidate(exercise, candidate) {
  const title = normalize(candidate.title ?? '')
  const source = normalize(candidate.source ?? '')
  const nameTokens = getTokens(exercise.name)
  const queryTokens = getTokens(exercise.giphyQuery)
  const titleMatches = nameTokens.filter((token) => title.includes(token)).length * 4
  const queryMatches = queryTokens.filter((token) => title.includes(token)).length
  const sourceBoost = TRUSTED_SOURCE_HINTS.some((hint) => source.includes(hint)) ? 4 : 0
  return titleMatches + queryMatches + sourceBoost
}

const results = []

for (const exercise of EXERCISES) {
  const existing = getExerciseVideo(exercise)
  const existingCheck = existing ? await checkVideo(existing.id) : null
  await sleep(100)

  const candidateIds = await searchCandidates(`${exercise.giphyQuery} physical therapy exercise`)
  const candidates = []
  for (const id of candidateIds) {
    const checked = await checkVideo(id)
    if (checked.ok) {
      candidates.push({
        ...checked,
        score: scoreCandidate(exercise, checked),
      })
    }
    await sleep(80)
  }
  candidates.sort((a, b) => b.score - a.score)

  results.push({
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    existing,
    existingCheck,
    bestCandidate: candidates[0] ?? null,
    candidates,
  })
}

const summary = {
  auditedAt: new Date().toISOString(),
  exerciseCount: EXERCISES.length,
  currentVideoCount: results.filter((item) => item.existing).length,
  currentWorkingCount: results.filter((item) => item.existingCheck?.ok).length,
  currentBroken: results
    .filter((item) => item.existing && !item.existingCheck?.ok)
    .map((item) => ({
      exerciseId: item.exerciseId,
      videoId: item.existing.id,
      status: item.existingCheck?.status,
    })),
  missingVideoCount: results.filter((item) => !item.existing).length,
}

await writeFile(
  'audits/youtube-video-audit.json',
  JSON.stringify({ summary, results }, null, 2)
)

console.log(JSON.stringify(summary, null, 2))
