import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, ChevronRight, Dumbbell, PlayCircle, Search, X } from 'lucide-react'
import { MUSCLE_LIST, MUSCLES } from '../data/muscles.js'
import { EXERCISES } from '../data/exercises.js'
import { getExerciseVideo } from '../data/youtubeVideos.js'

const DIFFICULTY_COLORS = {
  beginner: '#10b981',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

const GOAL_LABELS = {
  reduce_pain: 'pain relief',
  mobility: 'mobility',
  stretch: 'stretch',
  strengthen: 'strength',
}

const QUICK_SEARCHES = [
  'neck pain',
  'knee strength',
  'lower back mobility',
  'shoulder stretch',
  'no equipment',
  'beginner',
]

function normalize(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getTokens(query) {
  return normalize(query)
    .split(' ')
    .filter((token) => token.length > 1)
}

function scoreText(text, tokens, exactBoost = 4) {
  const normalized = normalize(text)
  if (!tokens.length || !normalized) return 0
  return tokens.reduce((score, token) => {
    if (normalized === token) return score + exactBoost + 3
    if (normalized.includes(token)) return score + exactBoost
    return score
  }, 0)
}

function getExerciseSearchText(exercise, video) {
  const muscles = exercise.muscles.flatMap((id) => {
    const muscle = MUSCLES[id]
    return [muscle?.name, ...(muscle?.keywords ?? [])]
  })
  return [
    exercise.name,
    exercise.description,
    exercise.difficulty,
    exercise.equipment,
    ...(exercise.goals ?? []).map((goal) => GOAL_LABELS[goal] ?? goal),
    ...(exercise.painTypes ?? []),
    ...(exercise.instructions ?? []),
    ...muscles,
    video?.title,
    video?.source,
  ]
}

function getExerciseScore(exercise, tokens) {
  if (!tokens.length) return 0
  const video = getExerciseVideo(exercise)
  const nameScore = scoreText(exercise.name, tokens, 12)
  const muscleScore = exercise.muscles.reduce((score, id, index) => {
    const muscle = MUSCLES[id]
    const primaryMultiplier = index === 0 ? 1 : 0.35
    return score + (
      scoreText(muscle?.name, tokens, 9) +
      scoreText(muscle?.keywords?.join(' '), tokens, 5)
    ) * primaryMultiplier
  }, 0)
  const goalScore = scoreText((exercise.goals ?? []).map((goal) => GOAL_LABELS[goal] ?? goal).join(' '), tokens, 7)
  const videoScore = scoreText(`${video?.title ?? ''} ${video?.source ?? ''}`, tokens, 4)
  const generalScore = scoreText(getExerciseSearchText(exercise, video).join(' '), tokens, 2)
  return nameScore + muscleScore + goalScore + videoScore + generalScore
}

function getMuscleScore(muscle, tokens) {
  if (!tokens.length) return 0
  return (
    scoreText(muscle.name, tokens, 12) +
    scoreText(muscle.category, tokens, 4) +
    scoreText(muscle.keywords.join(' '), tokens, 7) +
    scoreText(muscle.description, tokens, 2)
  )
}

function MuscleResult({ muscle, exerciseCount, onSelect, accentColor }) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => onSelect(muscle.id)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        background: '#0d1b2e',
        border: `1px solid ${accentColor}30`,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `${accentColor}20`,
          border: `1px solid ${accentColor}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Activity size={18} style={{ color: accentColor }} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 2 }}>
          {muscle.name}
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>
          {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''} • {muscle.category?.replace('_', ' ')}
        </div>
      </div>

      <ChevronRight size={16} style={{ color: '#475569' }} />
    </motion.button>
  )
}

function ExerciseResult({ exercise, onSelect }) {
  const primaryMuscle = MUSCLES[exercise.muscles[0]]
  const accentColor = primaryMuscle?.color || '#3b82f6'
  const video = getExerciseVideo(exercise)

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => onSelect(exercise)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        borderRadius: 8,
        background: '#0d1b2e',
        border: `1px solid ${accentColor}25`,
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: `${accentColor}15`,
          border: `1px solid ${accentColor}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Dumbbell size={18} style={{ color: accentColor }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>
          {exercise.name}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#64748b' }}>{primaryMuscle?.name}</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: 20,
              background: DIFFICULTY_COLORS[exercise.difficulty] + '20',
              color: DIFFICULTY_COLORS[exercise.difficulty],
              border: `1px solid ${DIFFICULTY_COLORS[exercise.difficulty]}40`,
            }}
          >
            {exercise.difficulty}
          </span>
          {exercise.goals.slice(0, 2).map((goal) => (
            <span key={goal} style={{ fontSize: 10, color: '#475569' }}>
              {(GOAL_LABELS[goal] ?? goal).replace('_', ' ')}
            </span>
          ))}
          {video && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#06b6d4' }}>
              <PlayCircle size={11} />
              video
            </span>
          )}
        </div>
      </div>

      <ChevronRight size={16} style={{ color: '#475569' }} />
    </motion.button>
  )
}

export default function SearchMode({ onMuscleSelect, onExerciseSelect }) {
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const tokens = useMemo(() => getTokens(query), [query])

  const muscleResults = useMemo(() => {
    if (searchType === 'exercises' || searchType === 'videos') return []
    const scored = MUSCLE_LIST.map((muscle) => ({
      muscle,
      score: tokens.length ? getMuscleScore(muscle, tokens) : 1,
    })).filter((item) => item.score > 0)
    return scored.sort((a, b) => b.score - a.score).map((item) => item.muscle)
  }, [searchType, tokens])

  const exerciseResults = useMemo(() => {
    if (searchType === 'muscles') return []
    const scored = EXERCISES.map((exercise) => ({
      exercise,
      score: tokens.length
        ? getExerciseScore(exercise, searchType === 'videos' ? [...tokens, 'video'] : tokens)
        : searchType === 'videos' ? 1 : 0,
    })).filter((item) => item.score > 0 && (searchType !== 'videos' || getExerciseVideo(item.exercise)))
    return scored.sort((a, b) => b.score - a.score || a.exercise.name.localeCompare(b.exercise.name)).map((item) => item.exercise)
  }, [searchType, tokens])

  const hasResults = muscleResults.length > 0 || exerciseResults.length > 0
  const showEmpty = query.length > 1 && !hasResults

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14, padding: '24px 20px' }}>
      <div>
        <h2
          style={{
            fontSize: 26,
            fontWeight: 850,
            color: '#f1f5f9',
            margin: 0,
            marginBottom: 6,
            letterSpacing: 0,
          }}
        >
          Search exercises and videos
        </h2>
        <p style={{ fontSize: 14, color: '#64748b' }}>
          Search by body area, goal, pain type, equipment, difficulty, exercise, or video source.
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#475569',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try: knee pain, shoulder mobility, band, beginner, Cleveland Clinic..."
          style={{
            width: '100%',
            padding: '13px 44px',
            borderRadius: 8,
            background: '#0d1b2e',
            border: '1px solid #1e3a5f',
            color: '#f1f5f9',
            fontSize: 15,
            outline: 'none',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All' },
          { id: 'muscles', label: 'Body areas' },
          { id: 'exercises', label: 'Exercises' },
          { id: 'videos', label: 'Videos' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setSearchType(type.id)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 750,
              cursor: 'pointer',
              background: searchType === type.id ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : '#1e3a5f30',
              border: searchType === type.id ? '1px solid transparent' : '1px solid #1e3a5f',
              color: searchType === type.id ? '#fff' : '#94a3b8',
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {!query && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUICK_SEARCHES.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              style={{
                border: '1px solid #1e3a5f',
                background: '#0d1b2e',
                color: '#94a3b8',
                borderRadius: 8,
                padding: '7px 10px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {showEmpty && (
          <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>
            <Search size={32} style={{ opacity: 0.35, margin: '0 auto 12px' }} />
            <p style={{ fontSize: 14 }}>No results for "{query}"</p>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>
              Try a body area, goal, equipment, difficulty, or video source.
            </p>
          </div>
        )}

        {muscleResults.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
              Body Areas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {muscleResults.map((muscle, idx) => {
                const exCount = EXERCISES.filter((exercise) => exercise.muscles[0] === muscle.id).length
                return (
                  <motion.div key={muscle.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                    <MuscleResult muscle={muscle} exerciseCount={exCount} onSelect={onMuscleSelect} accentColor={muscle.color} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {exerciseResults.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.08em', marginBottom: 8, textTransform: 'uppercase' }}>
              {searchType === 'videos' ? 'Exercise Videos' : 'Exercises'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {exerciseResults.map((exercise, idx) => (
                <motion.div key={exercise.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}>
                  <ExerciseResult exercise={exercise} onSelect={onExerciseSelect} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!query && searchType !== 'videos' && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#475569', letterSpacing: '0.08em', marginBottom: 12, textTransform: 'uppercase' }}>
              Browse by Body Region
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Upper Body', muscles: ['trapezius', 'chest', 'front-deltoids', 'biceps'], color: '#3b82f6' },
                { label: 'Core', muscles: ['abs', 'obliques', 'lower-back'], color: '#8b5cf6' },
                { label: 'Lower Body', muscles: ['quadriceps', 'hamstring', 'gluteal'], color: '#14b8a6' },
                { label: 'Arms & Wrists', muscles: ['biceps', 'triceps', 'forearm'], color: '#60a5fa' },
              ].map((region) => (
                <motion.button
                  key={region.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMuscleSelect(region.muscles[0])}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 8,
                    background: `${region.color}15`,
                    border: `1px solid ${region.color}30`,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: region.color, marginBottom: 4 }}>
                    {region.label}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>
                    {region.muscles.map((muscleId) => MUSCLES[muscleId]?.name).filter(Boolean).join(', ')}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
