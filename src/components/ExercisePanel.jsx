import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, PlayCircle, ShieldCheck, X } from 'lucide-react'
import ExerciseCard from './ExerciseCard.jsx'
import { MUSCLES } from '../data/muscles.js'
import { getExerciseVideo, getYouTubeEmbedUrl } from '../data/youtubeVideos.js'

const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'strengthen', label: 'Strengthen' },
  { id: 'stretch', label: 'Stretch' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'reduce_pain', label: 'Pain Relief' },
]

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-6"
      style={{ height: '100%', minHeight: 400, padding: 40 }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f620, #06b6d420)',
          border: '1px solid #3b82f640',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Activity size={36} style={{ color: '#3b82f6', opacity: 0.7 }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 8,
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Select a Muscle Group
        </h3>
        <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, maxWidth: 280 }}>
          Click on any muscle in the body map, use the search bar, or chat with the AI assistant to discover targeted exercises.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '100%',
          maxWidth: 260,
        }}
      >
        {['💪 Strengthen weak muscles', '🧘 Improve flexibility', '💊 Reduce chronic pain', '🔄 Restore mobility'].map(
          (tip) => (
            <div
              key={tip}
              style={{
                padding: '10px 14px',
                borderRadius: 10,
                background: '#0d1b2e',
                border: '1px solid #1e3a5f',
                fontSize: 13,
                color: '#64748b',
              }}
            >
              {tip}
            </div>
          )
        )}
      </div>
    </motion.div>
  )
}

export default function ExercisePanel({ selectedMuscleId, exercises, onClose }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeExerciseId, setActiveExerciseId] = useState(null)
  const [hasInteractedWithVideo, setHasInteractedWithVideo] = useState(false)

  const muscle = selectedMuscleId ? MUSCLES[selectedMuscleId] : null

  const exerciseCounts = useMemo(() => {
    return FILTER_TABS.reduce((counts, tab) => {
      counts[tab.id] =
        tab.id === 'all'
          ? exercises.length
          : exercises.filter((ex) => ex.goals.includes(tab.id)).length
      return counts
    }, {})
  }, [exercises])

  const filteredExercises = useMemo(() => {
    return activeFilter === 'all'
      ? exercises
      : exercises.filter((ex) => ex.goals.includes(activeFilter))
  }, [activeFilter, exercises])

  const activeExercise = useMemo(() => {
    return (
      filteredExercises.find((exercise) => exercise.id === activeExerciseId) ||
      filteredExercises[0] ||
      exercises[0] ||
      null
    )
  }, [activeExerciseId, exercises, filteredExercises])

  const activeVideo = getExerciseVideo(activeExercise)
  const activeVideoUrl = getYouTubeEmbedUrl(activeExercise, hasInteractedWithVideo)

  useEffect(() => {
    setActiveFilter('all')
    setActiveExerciseId(exercises[0]?.id ?? null)
    setHasInteractedWithVideo(false)
  }, [selectedMuscleId, exercises])

  useEffect(() => {
    if (!filteredExercises.length) return
    if (!filteredExercises.some((exercise) => exercise.id === activeExerciseId)) {
      setActiveExerciseId(filteredExercises[0].id)
    }
  }, [activeExerciseId, filteredExercises])

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#060b14',
      }}
    >
      <AnimatePresence mode="wait">
        {!muscle ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <EmptyState />
          </motion.div>
        ) : (
          <motion.div
            key={selectedMuscleId}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 20px 0',
                borderBottom: '1px solid #1e3a5f',
                paddingBottom: 16,
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: muscle.color,
                        boxShadow: `0 0 8px ${muscle.color}`,
                      }}
                    />
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                      {muscle.category?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${muscle.color}, #06b6d4)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: 6,
                    }}
                  >
                    {muscle.name}
                  </h2>
                  {muscle.description && (
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5, maxWidth: 380 }}>
                      {muscle.description}
                    </p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#1e3a5f40',
                      border: '1px solid #1e3a5f',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Exercise count */}
              <div style={{ marginTop: 12, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 20,
                    background: muscle.color + '20',
                    border: `1px solid ${muscle.color}40`,
                    color: muscle.color,
                  }}
                >
                  {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {/* Filter tabs */}
            <div
              style={{
                display: 'flex',
                gap: 6,
                padding: '12px 20px',
                overflowX: 'auto',
                flexShrink: 0,
                borderBottom: '1px solid #1e3a5f',
              }}
            >
              {FILTER_TABS.map((tab) => {
                const count = exerciseCounts[tab.id]
                if (count === 0 && tab.id !== 'all') return null

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      background:
                        activeFilter === tab.id
                          ? `linear-gradient(135deg, ${muscle.color}, #06b6d4)`
                          : '#1e3a5f30',
                      border: activeFilter === tab.id ? 'none' : '1px solid #1e3a5f',
                      color: activeFilter === tab.id ? '#fff' : '#64748b',
                      boxShadow: activeFilter === tab.id ? `0 0 12px ${muscle.color}40` : 'none',
                    }}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: 10,
                          opacity: 0.8,
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Exercise grid */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px',
              }}
            >
              {filteredExercises.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 40,
                    gap: 12,
                    color: '#475569',
                    textAlign: 'center',
                  }}
                >
                  <Activity size={32} style={{ opacity: 0.4 }} />
                  <p style={{ fontSize: 14 }}>No exercises for this filter</p>
                  <button
                    onClick={() => setActiveFilter('all')}
                    style={{
                      fontSize: 12,
                      color: muscle.color,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Show all exercises
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {activeExercise && (
                    <div>
                      {activeVideoUrl ? (
                        <div
                          style={{
                            borderRadius: 12,
                            overflow: 'hidden',
                            border: `1px solid ${muscle.color}45`,
                            background: '#050b13',
                            aspectRatio: '16 / 9',
                            boxShadow: `0 14px 34px ${muscle.color}16`,
                          }}
                        >
                          <iframe
                            key={`${activeExercise.id}-${hasInteractedWithVideo ? 'play' : 'ready'}`}
                            title={`${activeExercise.name} video`}
                            src={activeVideoUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 0,
                              display: 'block',
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            borderRadius: 12,
                            border: `1px solid ${muscle.color}35`,
                            background: `linear-gradient(135deg, ${muscle.color}18, #0d1b2e)`,
                            minHeight: 220,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: 28,
                          }}
                        >
                          <div style={{ maxWidth: 360 }}>
                            <div
                              style={{
                                width: 58,
                                height: 58,
                                borderRadius: 16,
                                margin: '0 auto 14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${muscle.color}18`,
                                border: `1px solid ${muscle.color}35`,
                                color: muscle.color,
                              }}
                            >
                              <PlayCircle size={28} />
                            </div>
                            <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800, marginBottom: 8 }}>
                              Video coming soon
                            </h3>
                            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>
                              Follow the written steps below while a matching demo video is being added.
                            </p>
                          </div>
                        </div>
                      )}

                      <div style={{ marginTop: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                          <h3 style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800 }}>
                            {activeExercise.name}
                          </h3>
                          {activeVideo && (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                fontWeight: 800,
                                color: '#10b981',
                                background: '#10b98118',
                                border: '1px solid #10b98135',
                                borderRadius: 999,
                                padding: '3px 8px',
                              }}
                            >
                              <ShieldCheck size={12} />
                              Verified video
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>
                          {activeExercise.description}
                        </p>
                        {activeVideo && (
                          <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.5, marginTop: 6 }}>
                            Video: {activeVideo.title} · {activeVideo.source}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                      gap: 16,
                    }}
                  >
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        style={{
                          contentVisibility: 'auto',
                          containIntrinsicSize: '220px',
                        }}
                      >
                        <ExerciseCard
                          exercise={exercise}
                          accentColor={muscle.color}
                          active={exercise.id === activeExercise?.id}
                          onSelect={() => {
                            setActiveExerciseId(exercise.id)
                            setHasInteractedWithVideo(true)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
