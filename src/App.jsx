import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Check, Clock, Dumbbell, Moon, Search, ShieldCheck, Sun, Zap } from 'lucide-react'
import BodyMap from './components/BodyMap.jsx'
import SearchMode from './components/SearchMode.jsx'
import ExercisePanel from './components/ExercisePanel.jsx'
import { MUSCLES } from './data/muscles.js'
import { EXERCISES } from './data/exercises.js'

const TABS = [
  { id: 'map', label: 'Body Map', Icon: Activity },
  { id: 'search', label: 'Search', Icon: Search },
]

const GOAL_CHOICES = [
  { id: 'reduce_pain', label: 'Reduce pain', helper: 'Calm things down', Icon: ShieldCheck, color: '#10b981' },
  { id: 'mobility', label: 'Move better', helper: 'Loosen stiffness', Icon: Activity, color: '#06b6d4' },
  { id: 'stretch', label: 'Stretch', helper: 'Quick relief work', Icon: Zap, color: '#f59e0b' },
  { id: 'strengthen', label: 'Get stronger', helper: 'Build support', Icon: Activity, color: '#8b5cf6' },
]

const TIME_CHOICES = [
  { id: '5', label: '5 min', exerciseLimit: 2 },
  { id: '10', label: '10 min', exerciseLimit: 3 },
  { id: '15', label: '15 min', exerciseLimit: 4 },
  { id: '20', label: '20+ min', exerciseLimit: 6 },
]

function getFocusedExercises(muscleIds, goalId, timeId) {
  const ids = Array.isArray(muscleIds) ? muscleIds : [muscleIds].filter(Boolean)
  const isPrimaryMatch = (exercise) => ids.includes(exercise.muscles[0])
  const isAnyMatch = (exercise) => ids.some((id) => exercise.muscles.includes(id))
  const primaryMatches = EXERCISES.filter(isPrimaryMatch)
  const secondaryMatches = EXERCISES.filter((exercise) => !isPrimaryMatch(exercise) && isAnyMatch(exercise))
  const applyGoal = (items) => {
    if (!goalId) return items
    const withGoal = items.filter((exercise) => exercise.goals.includes(goalId))
    return withGoal.length > 0 ? withGoal : items
  }
  const ordered = primaryMatches.length > 0
    ? applyGoal(primaryMatches)
    : applyGoal(secondaryMatches)
  const limit = TIME_CHOICES.find((time) => time.id === timeId)?.exerciseLimit
  const deduped = [...new Map(ordered.map((ex) => [ex.id, ex])).values()]
  return limit ? deduped.slice(0, limit) : deduped
}

function IntakeBoard({
  goalId,
  timeId,
  selectedMuscleIds,
  isCompact,
  theme,
  onGoalChange,
  onTimeChange,
  onMuscleSelect,
  onClearAreas,
  onBuildRoutine,
}) {
  const [hoveredMuscleId, setHoveredMuscleId] = useState(null)
  const selectedGoal = GOAL_CHOICES.find((goal) => goal.id === goalId)
  const selectedTime = TIME_CHOICES.find((time) => time.id === timeId)
  const isLight = theme === 'light'
  const surface = isLight ? '#ffffff' : '#0a1628'
  const control = isLight ? '#f7f9fc' : '#0d1b2e'
  const border = isLight ? '#d8e1ec' : '#1e3a5f'
  const text = isLight ? '#172033' : '#f1f5f9'
  const muted = isLight ? '#65758b' : '#94a3b8'
  const quiet = isLight ? '#7b8798' : '#64748b'
  const selectedAreas = selectedMuscleIds.map((id) => MUSCLES[id]?.name).filter(Boolean)
  const hoveredMuscle = hoveredMuscleId ? MUSCLES[hoveredMuscleId] : null
  const canBuild = selectedMuscleIds.length > 0 && goalId && timeId

  return (
    <section
      style={{
        width: '100%',
        maxWidth: isCompact ? 760 : 1120,
        maxHeight: isCompact ? 'none' : 'calc(100vh - 88px)',
        borderRadius: 8,
        border: `1px solid ${border}`,
        background: surface,
        padding: isCompact ? 12 : 14,
        overflow: isCompact ? 'visible' : 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? 12 : 9 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1
            style={{
              fontSize: isCompact ? 24 : 30,
              lineHeight: 1.05,
              fontWeight: 850,
              color: text,
              margin: 0,
              letterSpacing: 0,
            }}
          >
            Build a PT routine
          </h1>
          <p style={{ fontSize: 15, color: muted, lineHeight: 1.35, margin: 0 }}>
            Pick where, goal, and time. Keep it all on one screen.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isCompact ? '1fr' : 'minmax(240px, 0.8fr) minmax(330px, 1.2fr)',
            gap: 12,
            alignItems: 'stretch',
          }}
        >
          <div
            style={{
              border: `1px solid ${border}`,
              borderRadius: 8,
              background: control,
              padding: isCompact ? 14 : 12,
              display: 'flex',
              flexDirection: 'column',
              gap: isCompact ? 10 : 8,
              minHeight: isCompact ? 520 : 0,
            }}
          >
            <h1
              style={{
                fontSize: 13,
                color: quiet,
                fontWeight: 800,
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              1. Where?
            </h1>
            <p style={{ fontSize: 16, color: muted, lineHeight: 1.35, margin: 0 }}>
              What hurts or needs work? Click one or more body areas.
            </p>

            <div style={{ flex: 1, minHeight: 0, display: 'grid', placeItems: 'center' }}>
              <BodyMap
                selectedMuscleId={selectedMuscleIds}
                onMuscleClick={onMuscleSelect}
                theme={theme}
                compact={!isCompact}
                onHoverChange={setHoveredMuscleId}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isCompact ? '1fr' : 'minmax(130px, 0.8fr) minmax(0, 1.2fr)',
                gap: 10,
                alignItems: 'center',
                minHeight: 56,
              }}
            >
              <div
                style={{
                  borderRadius: 8,
                  border: `1px solid ${hoveredMuscle ? hoveredMuscle.color : border}`,
                  background: hoveredMuscle ? `${hoveredMuscle.color}${isLight ? '12' : '18'}` : surface,
                  padding: '8px 10px',
                }}
              >
                <div style={{ color: quiet, fontSize: 11, fontWeight: 850, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Hovering
                </div>
                <div style={{ color: hoveredMuscle?.color || text, fontSize: 18, fontWeight: 900, marginTop: 2 }}>
                  {hoveredMuscle?.name || 'Body map'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', minHeight: 36 }}>
                {selectedAreas.length > 0 ? (
                  <>
                    {selectedAreas.map((area) => (
                      <span
                        key={area}
                        style={{
                          borderRadius: 999,
                          background: isLight ? '#e8f3ff' : '#1e3a5f',
                          color: isLight ? '#1d4ed8' : '#bfdbfe',
                          fontSize: 14,
                          fontWeight: 800,
                          padding: '6px 10px',
                        }}
                      >
                        {area}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={onClearAreas}
                      style={{
                        border: `1px solid ${border}`,
                        background: surface,
                        color: quiet,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 800,
                        padding: '6px 9px',
                        cursor: 'pointer',
                      }}
                    >
                      Clear
                    </button>
                  </>
                ) : (
                  <span style={{ color: quiet, fontSize: 13 }}>No area selected yet</span>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 8,
                background: control,
                padding: isCompact ? 14 : 12,
              }}
            >
              <div style={{ fontSize: 12, color: quiet, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                2. Goal?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isCompact ? '1fr' : 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                {GOAL_CHOICES.map(({ id, label, helper, Icon, color }) => {
                  const selected = goalId === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onGoalChange(id)}
                      style={{
                        minHeight: isCompact ? 70 : 64,
                        borderRadius: 8,
                        border: `1px solid ${selected ? color : border}`,
                        background: selected ? `${color}${isLight ? '14' : '18'}` : surface,
                        color: text,
                        padding: isCompact ? 12 : 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Icon size={18} color={color} />
                        <span>
                          <span style={{ display: 'block', fontSize: 17, fontWeight: 850, lineHeight: 1.15 }}>{label}</span>
                          <span style={{ display: 'block', fontSize: 13, color: quiet, marginTop: 2 }}>{helper}</span>
                        </span>
                      </span>
                      {selected && <Check size={16} color={color} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 8,
                background: control,
                padding: isCompact ? 14 : 12,
              }}
            >
              <div style={{ fontSize: 12, color: quiet, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                3. Time?
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                {TIME_CHOICES.map(({ id, label }) => {
                  const selected = timeId === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onTimeChange(id)}
                      style={{
                        minHeight: isCompact ? 48 : 46,
                        borderRadius: 8,
                        border: selected ? '1px solid #06b6d4' : `1px solid ${border}`,
                        background: selected ? `#06b6d4${isLight ? '14' : '18'}` : surface,
                        color: text,
                        fontSize: 17,
                        fontWeight: 850,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        cursor: 'pointer',
                      }}
                    >
                      <Clock size={15} />
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              style={{
                border: `1px solid ${border}`,
                borderRadius: 8,
                background: isLight ? '#f7fbff' : '#07111f',
                padding: isCompact ? 14 : 12,
              }}
            >
              <div style={{ fontSize: 12, color: quiet, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Routine preview
              </div>
              <div style={{ fontSize: isCompact ? 20 : 22, color: text, fontWeight: 900, marginTop: 5 }}>
                {selectedGoal?.label} in {selectedTime?.label}
              </div>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.35, marginTop: 5 }}>
                {selectedAreas.length > 0
                  ? `Focused on ${selectedAreas.join(', ')}.`
                  : 'Choose a body area to make this specific.'}
              </p>
              <button
                type="button"
                onClick={onBuildRoutine}
                disabled={!canBuild}
                style={{
                  width: '100%',
                  minHeight: isCompact ? 48 : 46,
                  borderRadius: 8,
                  border: 'none',
                  background: canBuild
                    ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                    : isLight ? '#e8eef6' : '#1e3a5f',
                  color: canBuild ? '#042f2e' : quiet,
                  fontSize: 17,
                  fontWeight: 950,
                  marginTop: 12,
                  cursor: canBuild ? 'pointer' : 'not-allowed',
                }}
              >
                Build my routine
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function MobileExerciseDrawer({ isOpen, selectedMuscleId, exercises, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 40,
            }}
          />
          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80vh',
              background: '#060b14',
              borderRadius: '24px 24px 0 0',
              zIndex: 50,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #1e3a5f',
              borderBottom: 'none',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, flexShrink: 0 }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: '#1e3a5f' }} />
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ExercisePanel
                selectedMuscleId={selectedMuscleId}
                exercises={exercises}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const [mode, setMode] = useState('map')
  const [theme, setTheme] = useState(() => localStorage.getItem('pt-theme') || 'dark')
  const [goalId, setGoalId] = useState('reduce_pain')
  const [timeId, setTimeId] = useState('10')
  const [selectedMuscleId, setSelectedMuscleId] = useState(null)
  const [selectedMuscleIds, setSelectedMuscleIds] = useState([])
  const [selectedExercises, setSelectedExercises] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('pt-theme', theme)
  }, [theme])

  const handleMuscleSelect = useCallback((muscleId) => {
    setSelectedMuscleIds((current) => {
      const next = current.includes(muscleId)
        ? current.filter((id) => id !== muscleId)
        : [...current, muscleId]
      const nextSelectedMuscleId = next.includes(muscleId) ? muscleId : next.at(-1) || null
      setSelectedMuscleId(nextSelectedMuscleId)
      if (next.length === 0) {
        setSelectedExercises([])
        setPanelOpen(false)
        return next
      }
      if (panelOpen) {
        setSelectedExercises(getFocusedExercises(next, goalId, timeId))
      }
      return next
    })
  }, [goalId, panelOpen, timeId])

  const handleClearAreas = useCallback(() => {
    setSelectedMuscleId(null)
    setSelectedMuscleIds([])
    setSelectedExercises([])
    setPanelOpen(false)
  }, [])

  const handleMuscleFocus = useCallback((muscleId) => {
    setSelectedMuscleId(muscleId)
    setSelectedMuscleIds([muscleId])
    setSelectedExercises(getFocusedExercises([muscleId], goalId, timeId))
    setPanelOpen(true)
  }, [goalId, timeId])

  const handleBuildRoutine = useCallback(() => {
    if (selectedMuscleIds.length === 0) return
    setSelectedMuscleId((current) => current || selectedMuscleIds[0])
    setSelectedExercises(getFocusedExercises(selectedMuscleIds, goalId, timeId))
    setPanelOpen(true)
  }, [goalId, selectedMuscleIds, timeId])

  useEffect(() => {
    if (!panelOpen || selectedMuscleIds.length === 0) return
    setSelectedExercises(getFocusedExercises(selectedMuscleIds, goalId, timeId))
  }, [goalId, panelOpen, selectedMuscleIds, timeId])

  const handleExerciseSelect = useCallback((exercise) => {
    // Select the first muscle of the exercise
    const muscleId = exercise.muscles[0]
    handleMuscleFocus(muscleId)
  }, [handleMuscleFocus])

  const handlePanelClose = useCallback(() => {
    if (isMobile) {
      setPanelOpen(false)
    } else {
      setSelectedMuscleId(null)
      setSelectedMuscleIds([])
      setSelectedExercises([])
      setPanelOpen(false)
    }
  }, [isMobile])

  const muscle = selectedMuscleId ? MUSCLES[selectedMuscleId] : null

  return (
    <div
      className="pt-app"
      data-theme={theme}
      style={{
        minHeight: '100vh',
        background: '#060b14',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          height: 60,
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          flexShrink: 0,
          background: 'rgba(6,11,20,0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(59,130,246,0.5)',
            }}
          >
            <Dumbbell size={18} color="#fff" />
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
              }}
            >
              PT Guide
            </div>
            <div style={{ fontSize: 10, color: '#475569', lineHeight: 1, marginTop: 2 }}>
              Physical Therapy Assistant
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', gap: 4 }}>
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 14px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: 'none',
                background: mode === id
                  ? 'linear-gradient(135deg, #3b82f620, #06b6d420)'
                  : 'transparent',
                color: mode === id ? '#60a5fa' : '#64748b',
                borderBottom: mode === id ? '2px solid #3b82f6' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (mode !== id) e.currentTarget.style.color = '#94a3b8'
              }}
              onMouseLeave={(e) => {
                if (mode !== id) e.currentTarget.style.color = '#64748b'
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Selected muscle indicator */}
          <AnimatePresence>
            {muscle && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: muscle.color + '20',
                  border: `1px solid ${muscle.color}40`,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: muscle.color,
                    boxShadow: `0 0 6px ${muscle.color}`,
                  }}
                />
                <span style={{ fontSize: 12, fontWeight: 600, color: muscle.color }}>
                  {muscle.name}
                </span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  {selectedExercises.length} ex.
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid #1e3a5f',
              background: '#0d1b2e',
              color: theme === 'dark' ? '#fbbf24' : '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          height: 'calc(100vh - 60px)',
        }}
      >
        {/* ── LEFT PANEL ── */}
        <div
          style={{
            width: isMobile ? '100%' : panelOpen && !isMobile ? '45%' : '100%',
            transition: 'width 0.35s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRight: !isMobile && panelOpen ? '1px solid #1e3a5f' : 'none',
          }}
        >
          <AnimatePresence mode="wait">
            {mode === 'map' && (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: isMobile ? '14px' : '18px 20px',
                  gap: 16,
                }}
              >
                <IntakeBoard
                  goalId={goalId}
                  timeId={timeId}
                  selectedMuscleIds={selectedMuscleIds}
                  isCompact={isMobile}
                  theme={theme}
                  onGoalChange={setGoalId}
                  onTimeChange={setTimeId}
                  onMuscleSelect={handleMuscleSelect}
                  onClearAreas={handleClearAreas}
                  onBuildRoutine={handleBuildRoutine}
                />
              </motion.div>
            )}

            {mode === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                style={{ flex: 1, overflow: 'hidden' }}
              >
                <SearchMode
                  onMuscleSelect={handleMuscleFocus}
                  onExerciseSelect={handleExerciseSelect}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL (desktop) ── */}
        {!isMobile && (
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '55%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                style={{
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <ExercisePanel
                  selectedMuscleId={selectedMuscleId}
                  exercises={selectedExercises}
                  onClose={handlePanelClose}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── MOBILE DRAWER ── */}
        {isMobile && (
          <MobileExerciseDrawer
            isOpen={panelOpen}
            selectedMuscleId={selectedMuscleId}
            exercises={selectedExercises}
            onClose={handlePanelClose}
          />
        )}
      </main>
    </div>
  )
}
