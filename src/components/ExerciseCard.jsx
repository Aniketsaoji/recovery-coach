import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, Play, Repeat, Zap } from 'lucide-react'
import { MUSCLES } from '../data/muscles.js'

const DIFFICULTY_STYLES = {
  beginner: { label: 'Beginner', bg: '#10b98120', border: '#10b98140', text: '#10b981' },
  intermediate: { label: 'Intermediate', bg: '#f59e0b20', border: '#f59e0b40', text: '#f59e0b' },
  advanced: { label: 'Advanced', bg: '#ef444420', border: '#ef444440', text: '#ef4444' },
}

const EQUIPMENT_LABELS = {
  none: 'Bodyweight',
  resistance_band: 'Band',
  foam_roller: 'Foam Roller',
  chair: 'Chair',
  wall: 'Wall',
}

const GOAL_STYLES = {
  strengthen: { label: 'Strengthen', color: '#3b82f6' },
  stretch: { label: 'Stretch', color: '#06b6d4' },
  reduce_pain: { label: 'Pain Relief', color: '#ef4444' },
  mobility: { label: 'Mobility', color: '#8b5cf6' },
}

function ExerciseCard({ exercise, accentColor, active = false, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const difficulty = DIFFICULTY_STYLES[exercise.difficulty] || DIFFICULTY_STYLES.beginner
  const primaryMuscle = MUSCLES[exercise.muscles[0]]
  const cardAccent = accentColor || primaryMuscle?.color || '#3b82f6'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: '#0d1b2e',
        borderRadius: 12,
        border: `1px solid ${active ? cardAccent : `${cardAccent}30`}`,
        boxShadow: active ? `0 10px 30px ${cardAccent}24` : `0 4px 18px ${cardAccent}10`,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={onSelect}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 16,
          color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: active
                ? `linear-gradient(135deg, ${cardAccent}, #06b6d4)`
                : `${cardAccent}18`,
              border: `1px solid ${cardAccent}40`,
              color: active ? '#fff' : cardAccent,
            }}
          >
            <Play size={16} fill="currentColor" />
          </div>

          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#f1f5f9', marginBottom: 8, lineHeight: 1.3 }}>
              {exercise.name}
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: difficulty.bg,
                  border: `1px solid ${difficulty.border}`,
                  color: difficulty.text,
                }}
              >
                {difficulty.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: '#1e3a5f40',
                  border: '1px solid #1e3a5f',
                  color: '#94a3b8',
                }}
              >
                {EQUIPMENT_LABELS[exercise.equipment] || exercise.equipment}
              </span>
              {exercise.goals.slice(0, 2).map((goal) => {
                const g = GOAL_STYLES[goal]
                if (!g) return null
                return (
                  <span
                    key={goal}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 20,
                      background: g.color + '20',
                      border: `1px solid ${g.color}40`,
                      color: g.color,
                    }}
                  >
                    {g.label}
                  </span>
                )
              })}
            </div>

            <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              {exercise.description}
            </p>
          </div>
        </div>
      </button>

      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Repeat size={12} style={{ color: cardAccent }} />
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{exercise.sets} sets</span>
          </div>
          {exercise.reps && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Zap size={12} style={{ color: cardAccent }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>
                {exercise.reps} reps{exercise.hold ? ` • hold ${exercise.hold}s` : ''}
              </span>
            </div>
          )}
          {exercise.duration && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} style={{ color: cardAccent }} />
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{exercise.duration}s hold</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setExpanded((value) => !value)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 700,
            color: cardAccent,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide steps' : 'Show steps'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden' }}
            >
              <ol style={{ marginTop: 12, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {exercise.instructions.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: `${cardAccent}20`,
                        border: `1px solid ${cardAccent}40`,
                        color: cardAccent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5 }}>{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default memo(ExerciseCard)
