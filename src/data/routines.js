import { EXERCISES } from './exercises.js'

export const TIME_CHOICES = [
  { id: '5', label: '5 min', helper: 'Sneak it in between meetings', exerciseLimit: 2 },
  { id: '10', label: '10 min', helper: 'The sweet spot', exerciseLimit: 3 },
  { id: '15', label: '15 min', helper: 'Proper session', exerciseLimit: 4 },
  { id: '20', label: '20+ min', helper: 'Go deep', exerciseLimit: 6 },
]

export function getFocusedExercises(muscleIds, goalId, timeId, focusMuscleId = null) {
  const ids = Array.isArray(muscleIds) ? muscleIds : [muscleIds].filter(Boolean)
  if (ids.length === 0) return []

  const orderedIds = [
    focusMuscleId && ids.includes(focusMuscleId) ? focusMuscleId : null,
    ...ids,
  ].filter(Boolean)
  const uniqueOrderedIds = [...new Set(orderedIds)]
  const isPrimaryMatch = (exercise) => uniqueOrderedIds.includes(exercise.muscles[0])
  const isAnyMatch = (exercise) => uniqueOrderedIds.some((id) => exercise.muscles.includes(id))
  const muscleRank = (exercise) => {
    const ranks = exercise.muscles
      .map((id) => uniqueOrderedIds.indexOf(id))
      .filter((index) => index >= 0)
    return ranks.length > 0 ? Math.min(...ranks) : uniqueOrderedIds.length
  }
  const primaryMatches = EXERCISES.filter(isPrimaryMatch)
  const secondaryMatches = EXERCISES.filter((exercise) => !isPrimaryMatch(exercise) && isAnyMatch(exercise))
  const areaMatches = [...primaryMatches, ...secondaryMatches]
    .sort((a, b) => muscleRank(a) - muscleRank(b))
  const goalMatches = goalId
    ? areaMatches.filter((exercise) => exercise.goals.includes(goalId))
    : areaMatches
  const ordered = goalMatches.length > 0 ? goalMatches : areaMatches
  const limit = TIME_CHOICES.find((time) => time.id === timeId)?.exerciseLimit
  const deduped = [...new Map(ordered.map((exercise) => [exercise.id, exercise])).values()]

  return limit ? deduped.slice(0, limit) : deduped
}
