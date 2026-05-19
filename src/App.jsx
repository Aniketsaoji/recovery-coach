import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, AlertTriangle, Check, Clock, Dumbbell, Moon, Search, ShieldCheck, Sun, Zap } from 'lucide-react'
import BodyMap from './components/BodyMap.jsx'
import SearchMode from './components/SearchMode.jsx'
import ExercisePanel from './components/ExercisePanel.jsx'
import { MUSCLES } from './data/muscles.js'
import { TIME_CHOICES, getFocusedExercises } from './data/routines.js'

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

function WizardBoard({
  goalId,
  timeId,
  selectedMuscleIds,
  theme,
  isPhone = false,
  panelOpen = false,
  onGoalChange,
  onTimeChange,
  onMuscleSelect,
  onClearAreas,
  onBuildRoutine,
}) {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [maxStep, setMaxStep] = useState(1)

  const isLight = theme === 'light'
  const surface = isLight ? '#ffffff' : '#0a1628'
  const control = isLight ? '#f7f9fc' : '#0d1b2e'
  const border = isLight ? '#d8e1ec' : '#1e3a5f'
  const text = isLight ? '#172033' : '#f1f5f9'
  const muted = isLight ? '#65758b' : '#94a3b8'
  const quiet = isLight ? '#7b8798' : '#64748b'

  const selectedAreas = selectedMuscleIds.map((id) => MUSCLES[id]?.name).filter(Boolean)
  const selectedGoal = GOAL_CHOICES.find((g) => g.id === goalId)
  const canBuildRoutine = selectedMuscleIds.length > 0 && Boolean(goalId) && Boolean(timeId)

  const goTo = (next) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
    setMaxStep((m) => Math.max(m, next))
  }

  const handleGoalSelect = (id) => {
    onGoalChange(id)
    setTimeout(() => goTo(3), 160)
  }

  // Keep step access tied to user-selectable routine inputs.
  React.useEffect(() => {
    if (selectedMuscleIds.length === 0) {
      setStep(1)
      setMaxStep(1)
      return
    }
    setMaxStep((m) => Math.max(m, 2))
  }, [selectedMuscleIds])

  React.useEffect(() => {
    if (selectedMuscleIds.length > 0 && goalId) setMaxStep((m) => Math.max(m, 3))
  }, [goalId, selectedMuscleIds.length])

  const variants = {
    enter: (d) => ({ x: d > 0 ? 52 : -52, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -52 : 52, opacity: 0 }),
  }
  const tr = { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }

  const STEPS = [
    { n: 1, label: 'Area' },
    { n: 2, label: 'Goal' },
    { n: 3, label: 'Time' },
  ]

  return (
    <section
      style={{
        width: '100%',
        maxWidth: 520,
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: isPhone ? '20px 16px 24px' : '28px 32px 32px',
        overflow: 'hidden',
      }}
    >
      {/* Tagline */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: isPhone ? 20 : 24, fontWeight: 700, color: text, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Three questions to recover.
        </h1>
        <p style={{ fontSize: 13, color: muted, margin: '3px 0 0' }}>In the time you've got.</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 26 }}>
        {STEPS.map(({ n, label }, i) => {
          const reachable = n !== step && maxStep >= n
          return (
            <React.Fragment key={n}>
              {i > 0 && (
                <div style={{ flex: 1, height: 1.5, background: maxStep > i ? '#3b82f6' : border, transition: 'background .35s ease', margin: '0 6px' }} />
              )}
              <div
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: reachable ? 'pointer' : 'default' }}
                onClick={() => reachable && goTo(n)}
                title={reachable ? `Go back to ${label}` : undefined}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${step === n ? '#3b82f6' : maxStep >= n ? '#10b981' : border}`,
                  background: step === n ? 'rgba(59,130,246,.12)' : maxStep >= n ? 'rgba(16,185,129,.12)' : 'transparent',
                  color: step === n ? '#60a5fa' : maxStep >= n ? '#10b981' : quiet,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 600, transition: 'all .3s ease',
                  opacity: reachable ? 1 : step === n ? 1 : 0.5,
                }}>
                  {maxStep >= n && step !== n ? <Check size={12} /> : n}
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: step === n ? '#60a5fa' : maxStep >= n ? '#10b981' : quiet, transition: 'color .3s' }}>
                  {label}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      <AnimatePresence mode="wait" custom={dir}>

        {/* ── STEP 1: Body map ── */}
        {step === 1 && (
          <motion.div key="s1" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={tr}>
            <h2 style={{ fontSize: isPhone ? 18 : 20, fontWeight: 700, color: text, margin: '0 0 5px', letterSpacing: '-0.01em' }}>
              Where does it hurt?
            </h2>
            <p style={{ fontSize: 13, color: muted, margin: '0 0 18px', lineHeight: 1.45 }}>
              Tap the area. Multiple spots? Tap them all.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <BodyMap
                selectedMuscleId={selectedMuscleIds}
                onMuscleClick={onMuscleSelect}
                theme={theme}
                wizard
                mobile={isPhone}
              />
            </div>

            {selectedAreas.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
                {selectedAreas.map((area) => (
                  <span key={area} style={{ borderRadius: 999, background: isLight ? '#e8f3ff' : '#1e3a5f', color: isLight ? '#1d4ed8' : '#bfdbfe', fontSize: 12, fontWeight: 500, padding: '4px 10px' }}>
                    {area}
                  </span>
                ))}
                <button type="button" onClick={onClearAreas} style={{ border: `1px solid ${border}`, background: 'transparent', color: quiet, borderRadius: 7, fontSize: 12, fontWeight: 500, padding: '4px 8px', cursor: 'pointer' }}>
                  Clear
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => selectedMuscleIds.length > 0 && goTo(2)}
              style={{
                width: '100%', padding: '13px', borderRadius: 9, border: 'none',
                background: selectedMuscleIds.length > 0 ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : isLight ? '#e8eef6' : '#1e3a5f',
                color: selectedMuscleIds.length > 0 ? '#fff' : quiet,
                fontSize: 15, fontWeight: 600,
                cursor: selectedMuscleIds.length > 0 ? 'pointer' : 'default',
                opacity: selectedMuscleIds.length > 0 ? 1 : 0.45,
                transition: 'all .2s ease',
              }}
            >
              {selectedMuscleIds.length > 0 ? 'Next — set your goal →' : 'Tap an area to continue'}
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Goal ── */}
        {step === 2 && (
          <motion.div key="s2" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={tr}>
            <button type="button" onClick={() => goTo(1)} style={{ background: 'transparent', border: 'none', color: quiet, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '0 0 14px' }}>
              ← Back
            </button>

            <h2 style={{ fontSize: isPhone ? 18 : 20, fontWeight: 700, color: text, margin: '0 0 5px', letterSpacing: '-0.01em' }}>
              What's your goal?
            </h2>
            <p style={{ fontSize: 13, color: muted, margin: '0 0 18px' }}>
              For {selectedAreas.join(' & ')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {GOAL_CHOICES.map(({ id, label, helper, Icon, color }) => {
                const sel = goalId === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleGoalSelect(id)}
                    style={{
                      padding: '14px', borderRadius: 10,
                      border: `1.5px solid ${sel ? color : border}`,
                      background: sel ? `${color}${isLight ? '14' : '18'}` : control,
                      cursor: 'pointer', textAlign: 'left',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      minHeight: 90, transition: 'border-color .18s, background .18s',
                    }}
                  >
                    <Icon size={20} color={color} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: sel ? color : text, lineHeight: 1.2 }}>{label}</div>
                      <div style={{ fontSize: 12, color: quiet, marginTop: 3 }}>{helper}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Time ── */}
        {step === 3 && (
          <motion.div key="s3" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={tr}>
            <button type="button" onClick={() => goTo(2)} style={{ background: 'transparent', border: 'none', color: quiet, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '0 0 14px' }}>
              ← Back
            </button>

            <h2 style={{ fontSize: isPhone ? 18 : 20, fontWeight: 700, color: text, margin: '0 0 5px', letterSpacing: '-0.01em' }}>
              How long have you got?
            </h2>
            <p style={{ fontSize: 13, color: muted, margin: '0 0 18px' }}>
              {selectedAreas.join(' & ')} · {selectedGoal?.label}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {TIME_CHOICES.map(({ id, label, helper }) => {
                const sel = timeId === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onTimeChange(id)}
                    style={{
                      padding: '14px', borderRadius: 10,
                      border: `1.5px solid ${sel ? '#06b6d4' : border}`,
                      background: sel ? `rgba(6,182,212,${isLight ? '.1' : '.08'})` : control,
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                      minHeight: 78, transition: 'border-color .18s, background .18s',
                    }}
                  >
                    <Clock size={15} color={sel ? '#06b6d4' : quiet} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: sel ? '#06b6d4' : text }}>{label}</span>
                    <span style={{ fontSize: 11, color: sel ? 'rgba(6,182,212,.7)' : quiet }}>{helper}</span>
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {timeId && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={onBuildRoutine}
                  disabled={!canBuildRoutine}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 9, border: 'none',
                    background: canBuildRoutine
                      ? 'linear-gradient(135deg, #10b981, #06b6d4)'
                      : isLight ? '#e8eef6' : '#1e3a5f',
                    color: canBuildRoutine ? '#042f2e' : quiet,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: canBuildRoutine ? 'pointer' : 'not-allowed',
                    opacity: canBuildRoutine ? 1 : 0.55,
                  }}
                >
                  {canBuildRoutine ? (panelOpen ? 'Update routine' : 'Start the routine') : 'Choose an area first'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}

function MobileExerciseDrawer({ isOpen, selectedMuscleId, exercises, routineGoalId, onClose }) {
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
              height: 'min(88dvh, 760px)',
              background: '#060b14',
              borderRadius: '16px 16px 0 0',
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
                routineGoalId={routineGoalId}
                onClose={onClose}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Disclaimer({ theme, isPhone }) {
  const isLight = theme === 'light'

  return (
    <aside
      style={{
        width: '100%',
        maxWidth: 720,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        padding: isPhone ? '8px 10px' : '10px 12px',
        borderRadius: 10,
        border: `1px solid ${isLight ? '#d8e1ec' : '#1e3a5f'}`,
        background: isLight ? '#ffffff' : '#0d1b2e',
        color: isLight ? '#65758b' : '#94a3b8',
        fontSize: isPhone ? 11 : 12,
        lineHeight: 1.45,
      }}
    >
      <AlertTriangle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: 1 }} />
      <span>
        Not medical advice. Recovery Coach is a personal project for general exercise ideas; use your own
        discretion and check with a qualified professional if you have pain, injury, or medical concerns.
      </span>
    </aside>
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
  const [routineMuscleId, setRoutineMuscleId] = useState(null)
  const [routineGoalId, setRoutineGoalId] = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isPhone, setIsPhone] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1200)
      setIsPhone(window.innerWidth < 640)
    }
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
      return next
    })
  }, [])

  const handleClearAreas = useCallback(() => {
    setSelectedMuscleId(null)
    setSelectedMuscleIds([])
  }, [])

  const handleMuscleFocus = useCallback((muscleId) => {
    setSelectedMuscleId(muscleId)
    setSelectedMuscleIds([muscleId])
    setRoutineMuscleId(muscleId)
    setRoutineGoalId(goalId)
    setSelectedExercises(getFocusedExercises([muscleId], goalId, timeId, muscleId))
    setPanelOpen(true)
  }, [goalId, timeId])

  const handleBuildRoutine = useCallback(() => {
    if (selectedMuscleIds.length === 0) return
    const routineMuscleIds = [...selectedMuscleIds]
    const nextRoutineMuscleId = (
      selectedMuscleId && routineMuscleIds.includes(selectedMuscleId)
        ? selectedMuscleId
        : routineMuscleIds.at(-1)
    )
    setSelectedMuscleId(nextRoutineMuscleId)
    setRoutineMuscleId(nextRoutineMuscleId)
    setRoutineGoalId(goalId)
    setSelectedExercises(getFocusedExercises(routineMuscleIds, goalId, timeId, nextRoutineMuscleId))
    setPanelOpen(true)
  }, [goalId, selectedMuscleId, selectedMuscleIds, timeId])

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
      setRoutineMuscleId(null)
      setRoutineGoalId(null)
      setPanelOpen(false)
    }
  }, [isMobile])

  const headerMuscleId = panelOpen ? routineMuscleId : selectedMuscleId
  const muscle = headerMuscleId ? MUSCLES[headerMuscleId] : null

  return (
    <div
      className="pt-app"
      data-theme={theme}
      style={{
        minHeight: '100dvh',
        background: '#060b14',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          height: isPhone ? 54 : 60,
          borderBottom: '1px solid #1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isPhone ? '0 10px' : '0 24px',
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
              Recovery Coach
            </div>
            <div style={{ display: isPhone ? 'none' : 'block', fontSize: 10, color: '#475569', lineHeight: 1, marginTop: 2 }}>
              Smart routines for pain & mobility
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
                  display: isPhone ? 'none' : 'flex',
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
          height: isPhone ? 'calc(100dvh - 54px)' : 'calc(100dvh - 60px)',
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
                  padding: isPhone ? '8px' : isMobile ? '14px' : '18px 20px',
                  gap: isPhone ? 8 : 16,
                }}
              >
                <WizardBoard
                  goalId={goalId}
                  timeId={timeId}
                  selectedMuscleIds={selectedMuscleIds}
                  isPhone={isPhone}
                  theme={theme}
                  panelOpen={panelOpen}
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
                  isPhone={isPhone}
                />
              </motion.div>
            )}

          </AnimatePresence>
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: isPhone ? '0 8px 8px' : isMobile ? '0 14px 14px' : '0 20px 18px',
            }}
          >
            <Disclaimer theme={theme} isPhone={isPhone} />
          </div>
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
                  selectedMuscleId={routineMuscleId}
                  exercises={selectedExercises}
                  routineGoalId={routineGoalId}
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
            selectedMuscleId={routineMuscleId}
            exercises={selectedExercises}
            routineGoalId={routineGoalId}
            onClose={handlePanelClose}
          />
        )}
      </main>
    </div>
  )
}
