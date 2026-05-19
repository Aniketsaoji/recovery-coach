import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MUSCLES } from '../data/muscles.js'

const BODY_SILHOUETTE =
  'M110 20c-13.6 0-23 11.1-23 27.2 0 16.4 9.4 27.8 23 27.8s23-11.4 23-27.8C133 31.1 123.6 20 110 20ZM88 79c-13 8-23 22-29 43l-13 63c-3 17-4 52-2 84 6 7 17 8 25 2l8-74c3 18 5 36 1 55-9 47-17 112-15 218 7 17 26 20 38 8 7-43 8-89 9-132 1 43 2 89 9 132 12 12 31 9 38-8 2-106-6-171-15-218-4-19-2-37 1-55l8 74c8 6 19 5 25-2 2-32 1-67-2-84l-13-63c-6-21-16-35-29-43-7 7-15 11-23 11s-16-4-23-11Z'

const BODY_PARTS = {
  front: [
    {
      id: 'trapezius',
      label: 'Neck',
      d: 'M82 80c17 14 39 14 56 0 5 10 8 20 8 31-22 13-50 13-72 0 0-11 3-21 8-31Z',
      labelPoint: [110, 101],
    },
    {
      id: 'front-deltoids',
      label: 'Shoulders',
      d: 'M56 103c24 2 42 17 43 39-5 24-27 36-58 33-2-25 3-56 15-72Zm108 0c-24 2-42 17-43 39 5 24 27 36 58 33 2-25-3-56-15-72Z',
      labelPoint: [110, 141],
    },
    {
      id: 'chest',
      label: 'Chest',
      d: 'M76 96c19-15 49-15 68 0 10 24 7 51-7 68-17 9-37 9-54 0-14-17-17-44-7-68Z',
      labelPoint: [110, 135],
    },
    {
      id: 'biceps',
      label: 'Arms',
      d: 'M42 169c26-4 40 10 39 33l-8 74c-9 9-23 8-31-1-3-34-2-74 0-106Zm136 0c-26-4-40 10-39 33l8 74c9 9 23 8 31-1 3-34 2-74 0-106Z',
      labelPoint: [110, 228],
    },
    {
      id: 'forearm',
      label: 'Wrists',
      d: 'M42 245c8 10 23 12 34 4-2 20-5 35-10 45-8 8-18 7-24-1-1-14-1-31 0-48Zm136 0c-8 10-23 12-34 4 2 20 5 35 10 45 8 8 18 7 24-1 1-14 1-31 0-48Z',
      labelPoint: [110, 286],
    },
    {
      id: 'abs',
      label: 'Core',
      d: 'M84 158c15 8 37 8 52 0 10 28 8 62-5 86-13 10-29 10-42 0-13-24-15-58-5-86Z',
      labelPoint: [110, 204],
    },
    {
      id: 'obliques',
      label: 'Sides',
      d: 'M74 156c11 13 14 31 10 53l5 35c-15-8-24-23-28-44 1-20 5-35 13-44Zm72 0c-11 13-14 31-10 53l-5 35c15-8 24-23 28-44-1-20-5-35-13-44Z',
      labelPoint: [110, 235],
    },
    {
      id: 'adductors',
      label: 'Hips',
      d: 'M83 244c16 13 24 34 26 64l1 79c-14-23-23-62-27-117-1-10-1-19 0-26Zm54 0c-16 13-24 34-26 64l-1 79c14-23 23-62 27-117 1-10 1-19 0-26Z',
      labelPoint: [110, 283],
    },
    {
      id: 'quadriceps',
      label: 'Thighs',
      d: 'M59 242c20-11 42-3 50 19 5 35 2 82-9 124-10 14-29 14-39-1-9-44-10-104-2-142Zm102 0c-20-11-42-3-50 19-5 35-2 82 9 124 10 14 29 14 39-1 9-44 10-104 2-142Z',
      labelPoint: [110, 338],
    },
    {
      id: 'calves',
      label: 'Lower Legs',
      d: 'M65 371c13 13 32 13 43-1 5 44 1 85-13 114-11 9-25 7-31-5-6-39-5-76 1-108Zm90 0c-13 13-32 13-43-1-5 44-1 85 13 114 11 9 25 7 31-5 6-39 5-76-1-108Z',
      labelPoint: [110, 431],
    },
  ],
  back: [
    {
      id: 'trapezius',
      label: 'Neck',
      d: 'M78 84c20 10 44 10 64 0 9 18 10 35 3 51-20 12-50 12-70 0-7-16-6-33 3-51Z',
      labelPoint: [110, 115],
    },
    {
      id: 'front-deltoids',
      label: 'Shoulders',
      d: 'M56 103c24 2 42 17 43 39-5 24-27 36-58 33-2-25 3-56 15-72Zm108 0c-24 2-42 17-43 39 5 24 27 36 58 33 2-25-3-56-15-72Z',
      labelPoint: [110, 143],
    },
    {
      id: 'upper-back',
      label: 'Upper Back',
      d: 'M75 118c20 12 50 12 70 0 9 31 6 65-10 92-16 8-34 8-50 0-16-27-19-61-10-92Z',
      labelPoint: [110, 169],
    },
    {
      id: 'triceps',
      label: 'Arms',
      d: 'M42 169c26-4 40 10 39 33l-8 74c-9 9-23 8-31-1-3-34-2-74 0-106Zm136 0c-26-4-40 10-39 33l8 74c9 9 23 8 31-1 3-34 2-74 0-106Z',
      labelPoint: [110, 228],
    },
    {
      id: 'forearm',
      label: 'Wrists',
      d: 'M42 245c8 10 23 12 34 4-2 20-5 35-10 45-8 8-18 7-24-1-1-14-1-31 0-48Zm136 0c-8 10-23 12-34 4 2 20 5 35 10 45 8 8 18 7 24-1 1-14 1-31 0-48Z',
      labelPoint: [110, 286],
    },
    {
      id: 'lower-back',
      label: 'Low Back',
      d: 'M86 208c15 8 33 8 48 0 9 17 8 37-3 57-13 9-29 9-42 0-11-20-12-40-3-57Z',
      labelPoint: [110, 238],
    },
    {
      id: 'gluteal',
      label: 'Glutes',
      d: 'M63 252c19-13 42-7 47 16 0 25-12 45-33 49-18-8-24-47-14-65Zm94 0c-19-13-42-7-47 16 0 25 12 45 33 49 18-8 24-47 14-65Z',
      labelPoint: [110, 286],
    },
    {
      id: 'hamstring',
      label: 'Hamstrings',
      d: 'M59 302c20-11 42-3 50 19 4 28 1 58-9 83-10 14-29 14-39-1-8-31-10-72-2-101Zm102 0c-20-11-42-3-50 19-4 28-1 58 9 83 10 14 29 14 39-1 8-31 10-72 2-101Z',
      labelPoint: [110, 361],
    },
    {
      id: 'calves',
      label: 'Calves',
      d: 'M65 389c13 13 32 13 43-1 5 36 1 69-13 96-11 9-25 7-31-5-6-32-5-62 1-90Zm90 0c-13 13-32 13-43-1-5 36-1 69 13 96 11 9 25 7 31-5 6-32 5-62-1-90Z',
      labelPoint: [110, 436],
    },
  ],
}

const SEPARATOR_PATHS = {
  front:
    'M80 166c18 8 42 8 60 0M84 244c15 10 37 10 52 0M110 90v390M75 196c-7 29-8 55-1 78M145 196c7 29 8 55 1 78M62 371c14 14 34 14 46-1M158 371c-14 14-34 14-46-1',
  back:
    'M78 135c20 10 44 10 64 0M84 208c16 8 36 8 52 0M86 265c14 8 34 8 48 0M110 90v390M75 196c-7 29-8 55-1 78M145 196c7 29 8 55 1 78M62 389c14 13 34 13 46-1M158 389c-14 13-34 13-46-1',
}

function BodyBase({ clipId, view, theme }) {
  const isLight = theme === 'light'
  const bodyFill = isLight ? '#e9eff6' : '#17253a'
  const bodyStroke = isLight ? '#91a4b8' : '#53677f'
  const outlineStroke = isLight ? '#65758b' : '#6f849b'
  const separatorStroke = isLight ? 'rgba(255,255,255,0.68)' : 'rgba(255,255,255,0.28)'

  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <path d={BODY_SILHOUETTE} />
        </clipPath>
      </defs>
      <path d={BODY_SILHOUETTE} fill={bodyFill} stroke={bodyStroke} strokeWidth="1.4" />
      <g clipPath={`url(#${clipId})`} aria-hidden="true">
        <path
          d={SEPARATOR_PATHS[view]}
          fill="none"
          stroke={separatorStroke}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d={BODY_SILHOUETTE} fill="none" stroke={outlineStroke} strokeWidth="1.55" />
    </>
  )
}

function MuscleGroup({ part, selectedMuscleId, hoveredMuscle, onMuscleClick, onMouseEnter, onMouseLeave }) {
  const muscle = MUSCLES[part.id]
  if (!muscle) return null

  const selectedIds = Array.isArray(selectedMuscleId) ? selectedMuscleId : [selectedMuscleId].filter(Boolean)
  const isSelected = selectedIds.includes(part.id)
  const isHovered = hoveredMuscle === part.id
  const isDimmed = selectedIds.length > 0 && !isSelected

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${muscle.name}`}
      onClick={() => onMuscleClick(part.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onMuscleClick(part.id)
        }
      }}
      onMouseEnter={() => onMouseEnter(part.id)}
      onMouseLeave={onMouseLeave}
      style={{ cursor: 'pointer', outline: 'none' }}
    >
      <motion.path
        d={part.d}
        initial={false}
        animate={{
          fill: muscle.color,
          opacity: isSelected ? 0.9 : isHovered ? 0.78 : isDimmed ? 0.22 : 0.56,
          stroke: isSelected || isHovered ? '#f8fafc' : `${muscle.color}90`,
          strokeWidth: isSelected ? 2.1 : isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.16 }}
        filter={isSelected ? 'url(#selectedGlow)' : isHovered ? 'url(#softGlow)' : undefined}
      />
    </g>
  )
}

export default function BodyMap({ selectedMuscleId, onMuscleClick, theme = 'dark', compact = false, onHoverChange }) {
  const [view, setView] = useState('front')
  const [hoveredMuscle, setHoveredMuscle] = useState(null)
  const parts = BODY_PARTS[view]
  const selectedIds = Array.isArray(selectedMuscleId) ? selectedMuscleId : [selectedMuscleId].filter(Boolean)
  const activeId = hoveredMuscle || selectedIds[0]
  const activeMuscle = activeId ? MUSCLES[activeId] : null

  const selectedIsHidden = useMemo(() => {
    if (selectedIds.length === 0) return false
    return !selectedIds.some((id) => parts.some((part) => part.id === id))
  }, [parts, selectedIds])

  const clipId = `body-clip-${view}`
  const handleMouseEnter = (muscleId) => {
    setHoveredMuscle(muscleId)
    onHoverChange?.(muscleId)
  }
  const handleMouseLeave = () => {
    setHoveredMuscle(null)
    onHoverChange?.(null)
  }

  return (
    <div className="flex flex-col items-center" style={{ width: 'min(100%, 430px)', gap: compact ? 8 : 16 }}>
      <div
        className="flex items-center gap-1 p-1"
        style={{
          background: theme === 'light' ? '#ffffff' : '#0d1b2e',
          border: theme === 'light' ? '1px solid #d8e1ec' : '1px solid #1e3a5f',
          borderRadius: 12,
        }}
      >
        {['front', 'back'].map((nextView) => (
          <button
            key={nextView}
            onClick={() => setView(nextView)}
            className="px-4 py-1.5 text-sm font-semibold transition-all duration-200"
            style={{
              borderRadius: 8,
              padding: compact ? '4px 12px' : undefined,
              background:
                view === nextView ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
              color: view === nextView ? '#fff' : theme === 'light' ? '#64748b' : '#94a3b8',
              boxShadow: view === nextView ? '0 0 14px rgba(59,130,246,0.45)' : 'none',
            }}
          >
            {nextView === 'front' ? 'Front' : 'Back'}
          </button>
        ))}
      </div>

      {!compact && (
        <div className="flex items-center justify-center" style={{ minWidth: 210, height: 32 }}>
          <AnimatePresence mode="wait">
            {activeMuscle ? (
              <motion.div
                key={activeId}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: `${activeMuscle.color}26`,
                  border: `1px solid ${activeMuscle.color}66`,
                  color: activeMuscle.color,
                }}
              >
                {activeMuscle.name}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      )}

      <div
        className="relative"
        style={{
          width: compact ? 'clamp(135px, 16vw, 165px)' : 'clamp(270px, 32vw, 330px)',
          aspectRatio: '220 / 520',
          borderRadius: 8,
          background:
            theme === 'light'
              ? 'radial-gradient(circle at 50% 28%, rgba(59,130,246,0.12), transparent 36%)'
              : 'radial-gradient(circle at 50% 28%, rgba(59,130,246,0.12), transparent 34%)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.svg
            key={view}
            viewBox="0 0 220 520"
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0, x: view === 'front' ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: view === 'front' ? 16 : -16 }}
            transition={{ duration: 0.25 }}
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            <defs>
              <filter id="softGlow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="selectedGlow" x="-45%" y="-45%" width="190%" height="190%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <BodyBase clipId={clipId} view={view} theme={theme} />
            <g clipPath={`url(#${clipId})`}>
              {parts.map((part) => (
                <MuscleGroup
                  key={`${view}-${part.id}`}
                  part={part}
                  selectedMuscleId={selectedMuscleId}
                  hoveredMuscle={hoveredMuscle}
                  onMuscleClick={onMuscleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </g>
            <path
              d={SEPARATOR_PATHS[view]}
              fill="none"
              stroke={theme === 'light' ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.38)'}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
              clipPath={`url(#${clipId})`}
            />
            <path
              d={BODY_SILHOUETTE}
              fill="none"
              stroke={theme === 'light' ? '#65758b' : '#6f849b'}
              strokeWidth="1.55"
              pointerEvents="none"
            />
          </motion.svg>
        </AnimatePresence>
      </div>

      <div className="text-xs text-center" style={{ color: selectedIsHidden ? '#94a3b8' : '#475569', display: compact ? 'none' : 'block' }}>
        {selectedIsHidden
          ? `Switch to ${view === 'front' ? 'Back' : 'Front'} view to see the selected area`
          : 'Click directly on a body region to show exercises'}
      </div>
    </div>
  )
}
